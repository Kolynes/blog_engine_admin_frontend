import IJsonResponse from "../types/IJsonResponse";
import JsonResponseErrors from "./JsonResponseErrors";

export default class JsonResponseFacade implements IJsonResponse {
  data?: any;
  numberOfPages?: number | undefined;
  nextPage?: number | undefined;
  previousPage?: number | undefined;
  errors?: JsonResponseErrors | undefined;
  status: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  baseResponse?: Response;

  constructor(status: number, data?: any) {
    this.status = status;
    this.data = data;
  }
}