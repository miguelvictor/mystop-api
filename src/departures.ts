import { Hono } from "hono"
import { getDepartures } from "./lib/api/trafiklab/departures"

type Bindings = {
  KV_DEPARTURES: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get("/:id", async (c) => {
  const siteId = c.req.param("id")
  if (typeof siteId !== "string" || siteId.length === 0)
    return c.json({ error: "Invalid site id" }, 404)

  const cacheKey = `departures:${siteId}`
  const cached = await c.env.KV_DEPARTURES.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached))

  const departures = await getDepartures(siteId)
  await c.env.KV_DEPARTURES.put(cacheKey, JSON.stringify(departures), {
    expirationTtl: 60,
  })

  return c.json({ departures })
})

export default app
