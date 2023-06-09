import Request from "../lib/request"

export interface GiftCard {
  id: number
  code: string
  tokens_count: number
  days_count: number
  created_at: string
  updated_at: string
}

export default class GiftCardApi {
  static async activate(code: string) {
    return Request.postJson(`gift-cards:activate`, { code })
  }
}
