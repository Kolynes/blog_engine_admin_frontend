import Service from "../services/Service";
import { delay } from "../time";
import EContentTypes from "../types/EContentTypes";
import IIndexable from "../types/IIndexable";
import IJsonResponse from "../types/IJsonResponse";
import IJsonResponseClient, { JsonResponseAdapter } from "../types/IJsonResponseClient";
import JsonResponseErrors from "./JsonResponseErrors";

export default class JsonResponseClient extends Service implements IJsonResponseClient {
  protected baseUrl: string = "";
  protected headers: IIndexable = {};
  jsonResponseAdapter!: JsonResponseAdapter;
  protected debug: boolean = false;
  protected facade: IIndexable<IJsonResponse> = {};

  private async exec(
    url: string,
    method: string,
    body?: IIndexable,
    files?: IIndexable<FileList | File[]>,
    contentType?: EContentTypes
  ): Promise<IJsonResponse> {
    if (this.debug) {
      await delay(2000);
        return this.facade[url.split("?")[0]];
    }
    const processedHeaders = <IIndexable>{};
    for (var key in this.headers) {
      if (this.headers[key] instanceof Function)
        processedHeaders[key] = await this.headers[key]();
      else processedHeaders[key] = this.headers[key];
      if (!processedHeaders[key])
        delete processedHeaders[key];
    }
    if (body instanceof Object && contentType != EContentTypes.multipart && files === undefined)
      processedHeaders["content-type"] = EContentTypes.json;
    let response;
    let errors: JsonResponseErrors | undefined;
    try {
      response = await fetch(this.buildUrl(url), {
        method,
        headers: processedHeaders,
        body: this.buildBody(method, body, files, contentType)
      });
    } finally {
      const adaptedResponse = await this.jsonResponseAdapter(response, errors);
      if(adaptedResponse.status < 200 || adaptedResponse.status > 299)
        throw adaptedResponse;
      return adaptedResponse;
    }
  }

  private buildBody(
    method: string,
    body?: IIndexable,
    files?: IIndexable<FileList | File[]>,
    contentType?: EContentTypes
  ): BodyInit | null | undefined {
    if (method == "GET" || method == "HEAD" || method == "DELETE")
      return null;
    else if (files || contentType == EContentTypes.multipart) {
      var formData = new FormData();
      for (var fileKey in files)
        for (var file of files[fileKey])
          formData.append(fileKey, file);
      if (body)
        for (var key in body)
          formData.append(key, body[key]);
      return formData;
    }
    else if (!body)
      return undefined;
    else return JSON.stringify(body);
  }

  private buildUrl(url: string) {
    let reqURL;
    if (this.baseUrl) reqURL = new URL(`${this.baseUrl}${url}`);
    else reqURL = new URL(url);
    return reqURL.href;
  }

  get(url: string, query: IIndexable = {}): Promise<IJsonResponse> {
    const params = new URLSearchParams(query);
    let reqUrl;
    if (url.includes("?")) reqUrl = `${url}&${params.toString()}`;
    else reqUrl = `${url}?${params.toString()}`;
    return this.exec(reqUrl, "GET",);
  }

  post(
    url: string,
    data?: IIndexable,
    files?: IIndexable<FileList | File[]>,
    contentType?: EContentTypes
  ): Promise<IJsonResponse> {
    return this.exec(url, "POST", data, files, contentType);
  }

  patch(
    url: string,
    data?: IIndexable,
    files?: IIndexable<FileList | File[]>,
    contentType?: EContentTypes
  ): Promise<IJsonResponse> {
    return this.exec(url, "PATCH", data, files, contentType);
  }

  put(url: string, data?: IIndexable, contentType?: EContentTypes): Promise<IJsonResponse> {
    return this.exec(url, "PUT", data, undefined, contentType);
  }

  delete(url: string, data?: IIndexable, contentType?: EContentTypes): Promise<IJsonResponse> {
    return this.exec(url, "DELETE", data, undefined, contentType);
  }
}
