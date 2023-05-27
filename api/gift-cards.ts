import { request } from "../lib/request"

export async function activateGiftCard({ code }: { code: string }) {
  return request("gift-cards:activate", {
    method: "POST",
    body: JSON.stringify({
      code: code,
    }),
  })
}
