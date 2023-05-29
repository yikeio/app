import { request } from "../lib/request"

export async function getPlans(type: string) {
  return request(`pricings?quota_type=${type}`)
}

export async function getPayments() {
  return request(`payments`)
}

export async function createPayment(data: any) {
  return request(`payments`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getPayment(id: any) {
  return request(`payments/${id}`)
}
