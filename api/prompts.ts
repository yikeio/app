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
  conversations_count?: number
}

export type TabType = "all" | "featured" | "mine"

type TagId = number | string
type Query = { tag?: TagId[] }

export default class PromptApi {
  static list = async (query: Query) => {
    return Request.getJson(`prompts?${qs.stringify(query)}`)
  }

  static all = async (query: Query) => {
    let prompts: Prompt[] = []
    let page = 1
    const search = qs.stringify(query)

    while (true) {
      let res = await Request.getJson(`prompts?page=${page}&${search}`)

      if (!res || res.data?.length === 0) {
        break
      }
      page++
      prompts = prompts.concat(res.data)
    }

    return { data: prompts }
  }

  static featured = async (query: Query) => {
    return Request.getJson(`prompts:featured?${qs.stringify(query)}`)
  }

  static mine = async (query: Query) => {
    return Request.getJson(`prompts:mine?${qs.stringify(query)}`)
  }

  static tab = async (
    tabType: TabType,
    query: {
      tag?: TagId[]
    }
  ) => {
    switch (tabType) {
      case "all":
        return PromptApi.all(query)
      case "featured":
        return PromptApi.featured(query)
      case "mine":
        return PromptApi.mine(query)
    }
  }

  static get = async (id: number | string): Promise<Prompt> => {
    return Request.getJson(`prompts/${id}`)
  }
}
