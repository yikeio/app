import qs from "qs"

import Request from "../lib/request"

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
  static list = async ({ tag = [] }: { tag?: (number | string)[] }) => {
    const query = qs.stringify({ tag })
    return Request.getJson(`prompts?${query}`)
  }

  static get = async (id: number | string): Promise<Prompt> => {
    return Request.getJson(`prompts/${id}`)
  }
}
