import IJsonResponse from "../types/IJsonResponse";
import JsonResponseErrors from "./JsonResponseErrors";

export default class JsonResponse implements IJsonResponse {
    data?: any;
    numberOfPages?: number;
    nextPage?: number;
    previousPage?: number;
    error?: JsonResponseErrors;
    baseResponse?: Response;
  
    get status(): number {
      return this.baseResponse !== undefined 
        ?this.baseResponse.status
        :-1
    }
  
    get hasNextPage(): boolean {
      return this.nextPage != 0;
    }

    get hasPreviousPage(): boolean {
        return this.previousPage != 0;
    }
  
    private constructor(response?: Response) {
      if(response)
        this.baseResponse = response;
    }
  
    static async createJsonResponse(baseResponse?: Response, errors?: JsonResponseErrors): Promise<IJsonResponse> {
      if(baseResponse != null) {
        const json: IJsonResponse = await baseResponse.json();
        let response = new JsonResponse(baseResponse);
        response.data = json.data;
        response.numberOfPages = json.numberOfPages;
        response.nextPage = json.nextPage;
        response.previousPage = json.previousPage;
        response.error = json.error;
        return response;
      }
      else {
        const response = new JsonResponse();
        response.error = errors;
        return response;
      }
    }
  }