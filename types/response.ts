export enum RESPONSE {
  SUCCESS = "success",
  ERROR = "error",
}

export type Response = [response: RESPONSE, message: string]
