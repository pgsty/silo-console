// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  CopyIcon,
  ReadBox,
  ShareIcon,
  Grid,
  ProgressBar,
  Tooltip,
  Switch,
} from "mds";
import CopyToClipboard from "react-copy-to-clipboard";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { niceTimeFromSeconds } from "../../../../../../common/utils";
import {
  selDistSet,
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { getMaxShareLinkExpTime } from "screens/Console/ObjectBrowser/objectBrowserThunks";
import { maxShareLinkExpTime } from "screens/Console/ObjectBrowser/objectBrowserSlice";
import debounce from "lodash/debounce";
import { formatText, interpolate, useT } from "i18n";
import { isObjectTarget } from "../objectIdentity";
import { isAbortError, ObjectRequestGuard } from "../requestGuard";
import {
  resolveShareVersion,
  resolveUnversionedShareSubject,
  ShareSubject,
  shareSubjectKey,
  ShareVersionResolution,
} from "./shareSubject";

interface IShareFileProps {
  open: boolean;
  subject: ShareSubject;
  closeModalAndRefresh: () => void;
}

interface SubjectResolution {
  subjectKey: string;
  result: ShareVersionResolution;
}

const ShareFile = ({
  open,
  closeModalAndRefresh,
  subject,
}: IShareFileProps) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const distributedSetup = useSelector(selDistSet);
  const maxShareLinkExpTimeVal = useSelector(maxShareLinkExpTime);
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [toggleURL, setToggleURL] = useState<boolean>(false);
  const [resolution, setResolution] = useState<SubjectResolution | null>(null);
  const versionGuard = useRef(new ObjectRequestGuard<string>());
  const shareGuard = useRef(new ObjectRequestGuard<string>());

  // The subject is consumed through its scalar fields so effects depend on
  // identity, never on the reference of an object a parent rebuilds per render.
  const { bucket, key } = subject;
  const subjectIsTarget = isObjectTarget(subject);
  const subjectVersionId = subjectIsTarget
    ? subject.versionId
    : subject.version.kind === "id"
      ? subject.version.versionId
      : null;
  const subjectKey = shareSubjectKey(subject);

  const debouncedDateChange = useMemo(
    () =>
      debounce((newDate: string, isValid: boolean) => {
        setDateValid(isValid);
        if (isValid) {
          setSelectedDate(newDate);
          return;
        }
        setSelectedDate("");
        setShareURL("");
      }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedDateChange.cancel();
    };
  }, [debouncedDateChange]);

  useEffect(() => {
    const versions = versionGuard.current;
    const share = shareGuard.current;
    return () => {
      versions.invalidate();
      share.invalidate();
    };
  }, []);

  useEffect(() => {
    dispatch(getMaxShareLinkExpTime());
  }, [dispatch]);

  // Resolve the subject to one concrete version. A target needs no lookup; a
  // requested object is resolved against the exact-key versions listing, and
  // nothing is shared until that lookup has settled for this very subject.
  useEffect(() => {
    if (subjectIsTarget) {
      setResolution({
        subjectKey,
        result: { kind: "version", versionId: subjectVersionId || "" },
      });
      return;
    }
    const requested = {
      bucket,
      key,
      version:
        subjectVersionId === null
          ? ({ kind: "latest" } as const)
          : ({ kind: "id", versionId: subjectVersionId } as const),
    };
    if (!distributedSetup) {
      setResolution({
        subjectKey,
        result: resolveUnversionedShareSubject(requested),
      });
      return;
    }
    const guard = versionGuard.current;
    const ticket = guard.begin(subjectKey);
    setResolution(null);
    api.buckets
      .listObjects(
        bucket,
        { prefix: key, with_versions: true },
        { signal: ticket.signal },
      )
      .then((res) => {
        if (!ticket.isCurrent()) {
          return;
        }
        setResolution({
          subjectKey,
          result: resolveShareVersion(requested, {
            bucket,
            key,
            kind: "versions",
            items: res.data.objects || [],
          }),
        });
      })
      .catch((err) => {
        if (isAbortError(err) || !ticket.isCurrent()) {
          return;
        }
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setResolution({
          subjectKey,
          result: { kind: "none", reason: "not-found" },
        });
      });
    return () => {
      guard.invalidate();
    };
  }, [
    bucket,
    key,
    subjectIsTarget,
    subjectVersionId,
    subjectKey,
    distributedSetup,
    dispatch,
  ]);

  const activeResolution =
    resolution && resolution.subjectKey === subjectKey
      ? resolution.result
      : null;
  const resolvedVersionId =
    activeResolution?.kind === "version" ? activeResolution.versionId : null;

  useEffect(() => {
    if (!dateValid || resolvedVersionId === null) {
      return;
    }
    const guard = shareGuard.current;
    const ticket = guard.begin(subjectKey);
    setIsLoadingFile(true);
    setShareURL("");

    const slDate = new Date(`${selectedDate}`);
    const currDate = new Date();

    const diffDate = Math.ceil((slDate.getTime() - currDate.getTime()) / 1000);

    if (diffDate > 0) {
      api.buckets
        .shareObject(
          bucket,
          {
            prefix: key,
            version_id: resolvedVersionId,
            expires: selectedDate !== "" ? `${diffDate}s` : "",
            toggle_url: toggleURL,
          },
          { signal: ticket.signal },
        )
        .then((res) => {
          if (!ticket.isCurrent()) {
            return;
          }
          setShareURL(res.data);
          setIsLoadingFile(false);
        })
        .catch((err) => {
          if (isAbortError(err) || !ticket.isCurrent()) {
            return;
          }
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
          setShareURL("");
          setIsLoadingFile(false);
        });
    }
    return () => {
      guard.invalidate();
    };
  }, [
    bucket,
    key,
    subjectKey,
    resolvedVersionId,
    selectedDate,
    dateValid,
    toggleURL,
    dispatch,
  ]);

  const isLoadingVersion = activeResolution === null;

  const unavailableMessage = (
    reason: Extract<ShareVersionResolution, { kind: "none" }>["reason"],
  ): string => {
    switch (reason) {
      case "delete-marker":
        return t(
          "The current version of this object is a delete marker and cannot be shared.",
        );
      case "unversioned":
        return t(
          "This server does not expose object versions; only the current object can be shared.",
        );
      default:
        return t(
          "The selected object version could not be found. Refresh the object list and try again.",
        );
    }
  };

  return (
    <React.Fragment>
      <ModalWrapper
        title={t("Share File")}
        titleIcon={<ShareIcon style={{ fill: "#4CCB92" }} />}
        modalOpen={open}
        onClose={() => {
          closeModalAndRefresh();
        }}
      >
        {isLoadingVersion && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}
        {!isLoadingVersion && activeResolution.kind === "none" && (
          <Grid item xs={12} id="share-unavailable" sx={{ fontSize: 14 }}>
            {unavailableMessage(activeResolution.reason)}
          </Grid>
        )}
        {!isLoadingVersion && activeResolution.kind === "version" && (
          <Fragment>
            <Grid
              item
              xs={12}
              sx={{
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              <Tooltip
                placement="right"
                tooltip={
                  <span>
                    {t(
                      "You can reset your session by logging out and logging back in to the web UI.",
                    )}{" "}
                    <br /> <br />
                    {t(
                      "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.",
                    )}{" "}
                    <br /> <br />
                    {interpolate(
                      t(
                        "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.",
                      ),
                      { mcShare: <b>mc share</b> },
                    )}
                  </span>
                }
              >
                <span>
                  {t(
                    "The following URL lets you share this object without requiring a login.",
                  )}{" "}
                  <br />
                  {formatText(
                    t(
                      "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.",
                    ),
                    { time: niceTimeFromSeconds(maxShareLinkExpTimeVal) },
                  )}
                </span>
              </Tooltip>
            </Grid>
            <br />
            <Grid item xs={12}>
              <DaysSelector
                id="date"
                label={t("Active for")}
                maxSeconds={maxShareLinkExpTimeVal}
                onChange={debouncedDateChange}
                entity="Link"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginBottom: 10,
              }}
            >
              <ReadBox
                actionButton={
                  <CopyToClipboard text={shareURL}>
                    <Button
                      id={"copy-share-url"}
                      variant="regular"
                      onClick={() => {
                        dispatch(
                          setModalSnackMessage(
                            t("Share URL Copied to clipboard"),
                          ),
                        );
                      }}
                      disabled={shareURL === "" || isLoadingFile}
                      style={{
                        width: "28px",
                        height: "28px",
                        padding: "0px",
                      }}
                      icon={<CopyIcon />}
                    />
                  </CopyToClipboard>
                }
              >
                {shareURL}
              </ReadBox>
              <Switch
                sx={{
                  marginTop: 20,
                }}
                tooltip={t(
                  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable",
                )}
                id="switch_toggle_url"
                label={t("Toogle Share URL")}
                onChange={(e) => {
                  setToggleURL(e.target.checked);
                }}
              />
            </Grid>
          </Fragment>
        )}
      </ModalWrapper>
    </React.Fragment>
  );
};

export default ShareFile;
