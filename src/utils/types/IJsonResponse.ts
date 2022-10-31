import IJsonResponseErrors from "../http/JsonResponseErrors";

export default interface IJsonResponse {
  status: number;
  data?: any;
  numberOfPages?: number;
  nextPage?: number;
  previousPage?: number;
  error?: IJsonResponseErrors;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  baseResponse?: Response;
}