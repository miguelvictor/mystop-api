import { API_URL } from "./constants"

export async function getDepartures(siteId: string) {
  const url = API_URL + `/v1/sites/${siteId}/departures`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    console.error(`[getDepartures] ${response.status} ${response.statusText}`)
    console.error(`[getDepartures] ${await response.text()}`)
    throw new Error(`[getDepartures] ${response.status} ${response.statusText}`)
  }

  return response.json()
}
