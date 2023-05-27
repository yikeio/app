import { request } from "../lib/request"

export interface Prompt {
  id: number
  name: string
  description: string
  logo: string
  prompt_cn: string
  prompt_en: string
  settings: Record<string, any>
  sort_order: number
  created_at: string
  updated_at: string
}

export default class PromptApi {
  static list = async () => {
    return request("prompts")
  }

  static get = async (id: number | string): Promise<Prompt> => {
    return request(`prompts/${id}`)
  }
}
