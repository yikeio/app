import Request from "@/lib/request"

export interface Tag {
  id: number
  name: string
  icon?: string | null
}

export default class TagApi {
  static async getTags() {
    return Request.getJson("tags")
  }

  static async getAll() {
    let tags: Tag[] = []
    let page = 1

    while (true) {
      let res = await Request.getJson(`tags?page=${page}&per_page=50`)

      if (!res || res.data?.length === 0) {
        break
      }
      page++
      tags = tags.concat(res.data)
    }

    return tags
  }
}
