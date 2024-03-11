import { Hono } from "hono"
import { getDepartures } from "./lib/api/trafiklab/departures"
import { redis } from "./lib/redis"

const app = new Hono()

app.get("/:id", async (c) => {
  const siteId = c.req.param("id")
  if (typeof siteId !== "string" || siteId.length === 0)
    return c.json({ error: "Invalid site id" }, 404)

  const cacheKey = `departures:${siteId}`
  const cached = await redis.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached), 200, { "X-Redis-Cache": "HIT" })

  const departures = await getDepartures(siteId)
  await redis.set(cacheKey, JSON.stringify(departures), "EX", 10)

  return c.json({ departures }, 200, { "X-Redis-Cache": "MISS" })
})

export default app
