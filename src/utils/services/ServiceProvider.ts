import IIndexable from "../types/IIndexable";
import Service from "./Service";

export function service(serviceKey: any): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Object.defineProperty(
      target, 
      propertyKey, 
      { value: ServiceProvider.getInstance().getService(serviceKey) }
    );
  }
}

export default class ServiceProvider {
  private services: IIndexable<Service> = {};
  private keySet: Set<any> = new Set<any>();

  private constructor(){}

  static getInstance(): ServiceProvider {
    if(!window.serviceProvider)
      window.serviceProvider = new ServiceProvider();
    return window.serviceProvider as ServiceProvider;
  }

  getService<S extends Service>(key: any): S {
    const service = this.services[key] as S;
    if(!service)
      throw new Error(`The service '${key}' is not registered`)
    if(!service.isInitialized)
      service.initState();
    return service;
  }

  registerService(service: Service, key: any) {
    if(this.keySet.has(key))
      throw new Error(`A service with this key '${key}' has already been registered`);
    else {
      this.keySet.add(key);
      this.services[key] = service;
    }
  }
}