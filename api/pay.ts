import Request from "../lib/request"

export async function getPlans(type: string) {
  return Request.getJson(`pricings?quota_type=${type}`)
}

export async function getPayments() {
  return Request.getJson(`payments`)
}

export async function getPayment(id: any) {
  return Request.getJson(`payments/${id}`)
}
