import { Hono } from "hono"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"
import { cors } from "hono/cors"
import departures from "./departures"

const app = new Hono()
app.use(logger())
app.use(secureHeaders())
app.use(
  "/api/*",
  cors({ origin: ["https://mystop.themvqr.com", "http://localhost:5173"] })
)
app.route("/api/departures", departures)

const server = Bun.serve({ port: process.env.PORT || 3000, fetch: app.fetch })
console.log(`Listening on localhost: ${server.port}`)
