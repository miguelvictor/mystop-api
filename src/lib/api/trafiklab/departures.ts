import { z } from "zod"
import { API_URL } from "./constants"

const ResponseSchema = z.object({
  departures: z
    .object({
      destination: z.string(),
      direction_code: z.number(),
      direction: z.string(),
      state: z.enum(["ATSTOP", "EXPECTED"]),
      display: z.string(),
      journey: z.object({
        id: z.number(),
        state: z.enum(["NORMALPROGRESS", "EXPECTED", "ATORIGIN"]),
        prediction_state: z
          .enum(["NORMAL", "UNRELIABLE"])
          .nullable()
          .optional(),
      }),
      stop_area: z.object({
        id: z.number(),
        name: z.string(),
        type: z.enum(["RAILWSTN", "BUSTERM", "METROSTN"]),
      }),
      line: z.object({
        id: z.number(),
        designation: z.string(),
        transport_mode: z.enum(["TRAIN", "BUS", "METRO"]),
        group_of_lines: z.string().nullable().optional(),
      }),
    })
    .array(),
})

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

  const result = await ResponseSchema.spa(await response.json())
  if (!result.success) {
    console.error(`[getDepartures] Failed to invalidate schema`)
    console.error(`[getDepartures] ${JSON.stringify(result.error.issues)}`)
    throw new Error(`[getDepartures] ${JSON.stringify(result.error.issues)}`)
  }

  return result.data.departures
}
