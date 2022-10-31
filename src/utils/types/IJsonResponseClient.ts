import JsonResponseErrors from "../http/JsonResponseErrors";
import Service from "../services/Service";
import IIndexableObject from "./IIndexable";
import IJsonResponse from "./IJsonResponse";

export type JsonResponseAdapter = (baseResponse?: Response, errors?: JsonResponseErrors) => Promise<IJsonResponse>;

export default interface IJsonResponseClient extends Service {
  jsonResponseAdapter: JsonResponseAdapter;
  
  get(url: string, query?: IIndexableObject): Promise<IJsonResponse>;

  post(url: string, data?: IIndexableObject, files?: IIndexableObject<FileList | File[]>): Promise<IJsonResponse>;

  patch(url: string, data?: IIndexableObject, files?: IIndexableObject<FileList | File[]>): Promise<IJsonResponse>;

  put(url: string, data?: IIndexableObject): Promise<IJsonResponse>;

  delete(url: string, data?: IIndexableObject): Promise<IJsonResponse>;
} 