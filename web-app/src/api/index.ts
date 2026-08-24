import { Api, HttpResponse, FullRequestParams, ApiError } from "./consoleApi";
import {
  isInvalidSessionResponse,
  sessionExpiryTarget,
  shouldRedirectExpiredSession,
} from "./sessionExpiry";

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
  const internalResp = internalRequestFunc({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params,
  });
  return internalResp.then((e) => CommonAPIValidation(e));
};

export function CommonAPIValidation<D, E>(
  res: HttpResponse<D, E>,
): HttpResponse<D, E> {
  const err = res.error as ApiError;
  if (err && isInvalidSessionResponse(res.status, err.message)) {
    if (shouldRedirectExpiredSession(window.location.pathname, apiBasePath)) {
      document.location = sessionExpiryTarget(apiBasePath);
    }
  }
  return res;
}
