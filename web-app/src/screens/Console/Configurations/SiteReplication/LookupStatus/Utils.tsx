import React from "react";
import { StatsResponseType } from "../SiteReplicationStatus";
import { Box } from "mds";
import { interpolate, useT } from "i18n";

export function syncStatus(mismatch: boolean, set: boolean): string | boolean {
  if (!set) {
    return "";
  }
  return !mismatch;
}

export function isEntityNotFound(
  sites: Partial<StatsResponseType>,
  lookupList: Partial<StatsResponseType>,
  lookupKey: string,
) {
  const siteKeys: string[] = Object.keys(sites);
  return siteKeys.find((sk: string) => {
    // there is no way to find the type of this ! as it is an entry in the structure itself.
    // @ts-ignore
    const result: Record<string, any> = lookupList[sk] || {};
    return !result[lookupKey];
  });
}

export const EntityNotFound = ({
  entityType,
  entityValue,
}: {
  entityType: string;
  entityValue: string;
}) => {
  const t = useT();
  return (
    <Box
      sx={{
        marginTop: "45px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {interpolate(
        t("{type}: {name} not found.").replace("{type}", () => t(entityType)),
        {
          name: (
            <Box
              sx={{ marginLeft: "5px", marginRight: "5px", fontWeight: 600 }}
            >
              {entityValue}
            </Box>
          ),
        },
      )}
    </Box>
  );
};
