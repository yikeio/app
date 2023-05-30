import Request from "../lib/request"

export async function activateGiftCard({ code }: { code: string }) {
  return Request.postJson("gift-cards:activate", {
    code: code,
  })
}
