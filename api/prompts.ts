import { request } from "./common"

export default class PromptApi {
  static list = async () => {
    return request("prompts")
  }
}
