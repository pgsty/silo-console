import { Api, HttpResponse, FullRequestParams } from "./consoleApi";
import { settleWithSessionCheck } from "./sessionExpiry";
import { expireSession } from "./session";

export let api = new Api();
const apiBasePath = new URL(document.baseURI).pathname;
api.baseUrl = `${apiBasePath}api/v1`;
const internalRequestFunc = api.request;
api.request = async <T = any, E = any>({
  body,
  secure,
  path,
  type,
  query,
  format,
  baseUrl,
  cancelToken,
  ...params
}: FullRequestParams): Promise<HttpResponse<T, E>> => {
  // The transport rejects every non-2xx response, so the session check must
  // see rejections as well as fulfilled responses.
  return settleWithSessionCheck(
    internalRequestFunc<T, E>({
      body,
      secure,
      path,
      type,
      query,
      format,
      baseUrl,
      cancelToken,
      ...params,
    }),
    expireSession,
  );
};
