import { IStoreService } from "@/modules/store/types";
import { EServices } from "@/services/types";
import JsonResponse from "@/utils/http/JsonResponse";
import JsonResponseClient from "@/utils/http/JsonResponseClient";
import { serviceClass } from "@/utils/services/Service";
import ServiceProvider, { service } from "@/utils/services/ServiceProvider";
import IJsonResponseClient from "@/utils/types/IJsonResponseClient";

@serviceClass(EServices.http)
class HttpClient extends JsonResponseClient implements IJsonResponseClient {

  initState() {
    this.baseUrl = process.env.VUE_APP_BASE_URL;
    this.headers = {
      Authorization: () => this.getToken()
    },
    this.debug = false;
    this.jsonResponseAdapter = JsonResponse.createJsonResponse;
    super.initState();
  }

  async getToken(): Promise<string> {
    const store = ServiceProvider.getInstance().getService<IStoreService>(EServices.store)
    return store.AccountModule.token !== null && store.AccountModule.token !== undefined
      ? store.AccountModule.token
      : "";
  }
}