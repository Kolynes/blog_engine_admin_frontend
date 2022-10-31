import { Vue, Component } from "vue-property-decorator";
import IIndexable from "../types/IIndexable";
import IJsonResponse from "../types/IJsonResponse";

type ErrorHandler = (response: IJsonResponse) => void;

@Component
export default class NetworkManagerMixin extends Vue {
  error: IIndexable<string> = {};
  errorFields = {};
  loading: IIndexable<boolean> = {};
  errorHandlers: IIndexable<ErrorHandler[]> = {};
  failed: IIndexable<string> = {};
}

export function onError(status: number): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor) => {
    if (!target.errorHandlers) Object.defineProperty(target, "errorHandlers", { value: {} });
    if (!target.errorHandlers[status]) target.errorHandlers[status] = [target[propertyKey]];
    else target.errorHandlers[status].push(target[propertyKey])
  }
}

export function throwsNetworkError(summary: string = "Oops! Looks like you are offline.", fields?: IIndexable<string[]>): MethodDecorator {
  return <M>(target: any, propertyKey: string | symbol, description: TypedPropertyDescriptor<M>): TypedPropertyDescriptor<M> => {
    const method = Object.getOwnPropertyDescriptor(target, propertyKey)!.value
    const newMethod = (async function (this: NetworkManagerMixin, ...args: any[]) {
      this.$set(this.error, propertyKey as string, "");
      this.errorFields = {};
      try {
        this.$set(this.loading, propertyKey as string, true);
        const response = await method.bind(this)(...args);
        this.$set(this.loading, propertyKey as string, false);
        this.$set(this.failed, propertyKey as string, "");
        return response;
      } catch (response) {
        console.error(response)
        this.$set(this.loading, propertyKey as string, false);
        this.$set(this.error, propertyKey as string, (response as IJsonResponse).error!.summary || summary);
        this.$set(this.failed, propertyKey as string, (response as IJsonResponse).error!.summary || summary);
        this.errorFields = (response as IJsonResponse).error!.fields || fields;
        for (let errorHandler of this.errorHandlers[(response as IJsonResponse).status] || []) {
          errorHandler.bind(this)(response as IJsonResponse);
        }
        return response;
      }
    })
    return {
      ...description,
      value: newMethod as unknown as M
    }
  }
}