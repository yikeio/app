import { request } from "./common"

export async function activateGiftCard({ code }: { code: string }) {
  return request("gift-cards:activate", {
    method: "POST",
    body: JSON.stringify({
      code: code,
    }),
  })
}
