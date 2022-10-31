import IIndexableObject from "../types/IIndexable";

export default class JsonResponseErrors {
  constructor(
    readonly summary: string, 
    readonly fields: IIndexableObject = {}
  ) {}
}