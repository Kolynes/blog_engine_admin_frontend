import IJsonResponse from "../types/IJsonResponse";
import JsonResponseErrors from "./JsonResponseErrors";

export default class JackocoinsJsonResponse implements IJsonResponse {
  status!: number;
  data?: any;
  numberOfPages?: number | undefined;
  nextPage?: number | undefined;
  previousPage?: number | undefined;
  errors?: JsonResponseErrors | undefined;
  hasNextPage?: boolean | undefined;
  hasPreviousPage?: boolean | undefined;
  baseResponse?: Response | undefined;

  private constructor(){}

  static async createResponse(baseResponse?: Response): Promise<IJsonResponse> {
    if(baseResponse !== null && baseResponse !== undefined) {
      const json = await baseResponse.json();
      const response = new JackocoinsJsonResponse();
      response.baseResponse = baseResponse;
      response.data = json.data;
      response.errors = new JsonResponseErrors(json.errors.summary, json.errors.fields)
      response.status = baseResponse.status;
      return response;
    }
    else {
      const response = new JackocoinsJsonResponse();
      response.status = 0;
      response.errors = new JsonResponseErrors("");
      return response;
    }
  }

}