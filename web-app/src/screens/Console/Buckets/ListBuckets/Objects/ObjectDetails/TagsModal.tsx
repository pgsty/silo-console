// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { Fragment, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import {
  AddNewTagIcon,
  Button,
  DisabledIcon,
  EditTagIcon,
  InputBox,
  SectionTitle,
  Box,
  Grid,
  Tag,
  FormLayout,
} from "mds";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { useSelector } from "react-redux";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import {
  selDistSet,
  setModalErrorSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { interpolate, useT } from "i18n";
import { ObjectTarget } from "../objectIdentity";

interface ITagModal {
  modalOpen: boolean;
  // The validated object version every tag mutation addresses.
  target: ObjectTarget;
  // Display data (current tags) for that same version.
  actualInfo: BucketObject;
  onCloseAndUpdate: (refresh: boolean) => void;
}

const DeleteTag = styled.b(({ theme }) => ({
  color: get(theme, "signalColors.danger", "#C83B51"),
  marginLeft: 5,
}));

const AddTagModal = ({
  modalOpen,
  onCloseAndUpdate,
  target,
  actualInfo,
}: ITagModal) => {
  const bucketName = target.bucket;
  const dispatch = useAppDispatch();
  const t = useT();
  const distributedSetup = useSelector(selDistSet);
  const [newKey, setNewKey] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(false);
  const [deleteKey, setDeleteKey] = useState<string>("");
  const [deleteLabel, setDeleteLabel] = useState<string>("");

  const currentTags = actualInfo.tags;
  const currTagKeys = Object.keys(currentTags || {});

  const allPathData = target.key.split("/");
  const currentItem = allPathData.pop() || "";

  const resetForm = () => {
    setNewLabel("");
    setNewKey("");
  };

  const addTagProcess = () => {
    setIsSending(true);
    const newTag: any = {};

    newTag[newKey] = newLabel;
    const newTagList = { ...currentTags, ...newTag };

    const verID = distributedSetup ? target.versionId : "null";

    api.buckets
      .putObjectTags(
        bucketName,
        { prefix: target.key, version_id: verID },
        { tags: newTagList },
      )
      .then(() => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSending(false);
      });
  };

  const deleteTagProcess = () => {
    const cleanObject: any = { ...currentTags };
    delete cleanObject[deleteKey];

    const verID = distributedSetup ? target.versionId : "null";

    api.buckets
      .putObjectTags(
        bucketName,
        { prefix: target.key, version_id: verID },
        { tags: cleanObject },
      )
      .then(() => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSending(false);
      });
  };

  const onDeleteTag = (tagKey: string, tag: string) => {
    setDeleteKey(tagKey);
    setDeleteLabel(tag);
    setDeleteEnabled(true);
  };

  const cancelDelete = () => {
    setDeleteKey("");
    setDeleteLabel("");
    setDeleteEnabled(false);
  };

  const tagsFor = (plural: boolean) => (
    <Box
      sx={{
        fontSize: 16,
        margin: "20px 0 30px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
      }}
    >
      {interpolate(plural ? t("Tags for: {object}") : t("Tag for: {object}"), {
        object: <strong>{currentItem}</strong>,
      })}
    </Box>
  );

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title={deleteEnabled ? t("Delete Tag") : t("Edit Tags")}
        onClose={() => {
          onCloseAndUpdate(true);
        }}
        iconColor={deleteEnabled ? "delete" : "default"}
        titleIcon={deleteEnabled ? <DisabledIcon /> : <EditTagIcon />}
      >
        {deleteEnabled ? (
          <Fragment>
            <Grid container>
              {tagsFor(false)}
              {interpolate(
                t("Are you sure you want to delete the tag {tag}?"),
                {
                  tag: (
                    <DeleteTag>
                      {deleteKey} : {deleteLabel}
                    </DeleteTag>
                  ),
                },
              )}
              <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
                <Button
                  id={"cancel"}
                  type="button"
                  variant="regular"
                  onClick={cancelDelete}
                  label={t("Cancel")}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={deleteTagProcess}
                  id={"deleteTag"}
                  label={t("Delete Tag")}
                />
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <Box>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_TAGGING,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  width: "100%",
                }}
              >
                {tagsFor(true)}
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: "normal",
                  }}
                >
                  {t("Current Tags:")}
                  <br />
                  {currTagKeys.length === 0 ? (
                    <span className={"muted"}>
                      {t("There are no tags for this object")}
                    </span>
                  ) : (
                    <Fragment />
                  )}
                  <Box sx={{ marginTop: "5px", marginBottom: "15px" }}>
                    {currTagKeys.map((tagKey: string, index: number) => {
                      const tag = get(currentTags, `${tagKey}`, "");
                      if (tag !== "") {
                        return (
                          <SecureComponent
                            key={`chip-${index}`}
                            scopes={[
                              IAM_SCOPES.S3_DELETE_OBJECT_TAGGING,
                              IAM_SCOPES.S3_DELETE_ACTIONS,
                            ]}
                            resource={bucketName}
                            errorProps={{
                              deleteIcon: null,
                              onDelete: null,
                            }}
                          >
                            <Tag
                              id={`${tagKey} : ${tag}`}
                              label={`${tagKey} : ${tag}`}
                              variant={"regular"}
                              color={"default"}
                              onDelete={() => {
                                onDeleteTag(tagKey, tag);
                              }}
                            />
                          </SecureComponent>
                        );
                      }
                      return null;
                    })}
                  </Box>
                </Box>
              </Box>
            </SecureComponent>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ]}
              resource={bucketName}
              errorProps={{ disabled: true, onClick: null }}
            >
              <Box>
                <SectionTitle icon={<AddNewTagIcon />} separator={false}>
                  {t("Add New Tag")}
                </SectionTitle>
                <FormLayout containerPadding={false} withBorders={false}>
                  <InputBox
                    value={newKey}
                    label={t("Tag Key")}
                    id={"newTagKey"}
                    name={"newTagKey"}
                    placeholder={t("Enter Tag Key")}
                    onChange={(e) => {
                      setNewKey(e.target.value);
                    }}
                  />
                  <InputBox
                    value={newLabel}
                    label={t("Tag Label")}
                    id={"newTagLabel"}
                    name={"newTagLabel"}
                    placeholder={t("Enter Tag Label")}
                    onChange={(e) => {
                      setNewLabel(e.target.value);
                    }}
                  />
                  <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
                    <Button
                      id={"clear"}
                      type="button"
                      variant="regular"
                      color="primary"
                      onClick={resetForm}
                      label={t("Clear")}
                    />
                    <Button
                      type="submit"
                      variant="callAction"
                      disabled={
                        newLabel.trim() === "" ||
                        newKey.trim() === "" ||
                        isSending
                      }
                      onClick={addTagProcess}
                      id="saveTag"
                      label={t("Save")}
                    />
                  </Grid>
                </FormLayout>
              </Box>
            </SecureComponent>
          </Box>
        )}
      </ModalWrapper>
    </Fragment>
  );
};

export default AddTagModal;
