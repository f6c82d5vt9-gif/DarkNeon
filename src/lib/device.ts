import type { RealtimeChannel } from "@supabase/supabase-js"
import { DEVICE_ID, MAX_POINTS, SENSOR_MAX, SENSOR_MIN } from "../product"
import { db, IS_DEMO } from "./supabase"

export type Reading = {
  value: number
  created_at: string
}
export type Status = "disconnected" | "connecting" | "connected" | "error"

type ConnectOptions = {
  onInit: (rows: Reading[]) => void
  onReading: (row: Reading) => void
  onStatus: (s: Status) => void
}

let channel: RealtimeChannel | null = null
let demoTimer: ReturnType<typeof setInterval> | null = null
let demoPower = false
let connectionVersion = 0

function makeDemoValue(elapsedSeconds: number) {
  const normalized = (Math.sin(elapsedSeconds * 0.8) + 1) / 2
  return Math.round(SENSOR_MIN + normalized * (SENSOR_MAX - SENSOR_MIN))
}

export async function connectSensor(opts: ConnectOptions): Promise<void> {
  const version = ++connectionVersion
  await disconnectActiveConnection()
  opts.onStatus("connecting")

  if (IS_DEMO) {
    const now = Date.now()
    const rows = Array.from({ length: MAX_POINTS }, (_, index) => {
      const timestamp = now - (MAX_POINTS - index) * 500
      return {
        value: makeDemoValue((timestamp - now) / 1000),
        created_at: new Date(timestamp).toISOString(),
      }
    })
    opts.onInit(rows)
    opts.onStatus("connected")

    const startedAt = Date.now()
    demoTimer = setInterval(() => {
      if (version !== connectionVersion) return
      opts.onReading({
        value: makeDemoValue((Date.now() - startedAt) / 1000),
        created_at: new Date().toISOString(),
      })
    }, 500)
    return
  }

  try {
    const { data, error } = await db
      .from("sensor_readings")
      .select("value, created_at")
      .eq("device_id", DEVICE_ID)
      .order("created_at", { ascending: false })
      .limit(MAX_POINTS)

    if (error) throw error
    if (version !== connectionVersion) return

    opts.onInit(((data ?? []) as Reading[]).reverse())
    channel = db
      .channel(`sensor-readings-${DEVICE_ID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `device_id=eq.${DEVICE_ID}`,
        },
        (payload) => opts.onReading(payload.new as Reading),
      )
      .subscribe((state) => {
        if (version !== connectionVersion) return
        if (state === "SUBSCRIBED") opts.onStatus("connected")
        if (state === "CHANNEL_ERROR" || state === "TIMED_OUT")
          opts.onStatus("error")
      })
  } catch {
    if (version === connectionVersion) opts.onStatus("error")
  }
}

async function disconnectActiveConnection() {
  if (demoTimer) {
    clearInterval(demoTimer)
    demoTimer = null
  }
  if (channel) {
    const activeChannel = channel
    channel = null
    await db.removeChannel(activeChannel)
  }
}

export async function disconnectSensor(): Promise<void> {
  connectionVersion += 1
  await disconnectActiveConnection()
}

export async function setLedPower(on: boolean): Promise<boolean> {
  if (IS_DEMO) {
    demoPower = on
    return true
  }

  const { error } = await db
    .from("device_state")
    .update({ led_on: on, updated_at: new Date().toISOString() })
    .eq("device_id", DEVICE_ID)
  return !error
}

export async function loadPower(): Promise<boolean> {
  if (IS_DEMO) return demoPower

  const { data, error } = await db
    .from("device_state")
    .select("led_on")
    .eq("device_id", DEVICE_ID)
    .single()
  if (error) return false
  return Boolean(data.led_on)
}
