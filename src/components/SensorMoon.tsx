import type { CSSProperties } from "react"
import { SENSOR_MAX, SENSOR_MIN } from "../product"

type SensorMoonProps = {
  value?: number
  power: boolean
}

type MoonStyle = CSSProperties & {
  "--level": number
}

export function SensorMoon({ value, power }: SensorMoonProps) {
  const rawLevel =
    value === undefined ? 0 : (value - SENSOR_MIN) / (SENSOR_MAX - SENSOR_MIN)
  const level = Math.min(1, Math.max(0, rawLevel))
  const brightness = Math.round(level * 100)
  const formattedValue =
    value === undefined ? "—" : value.toLocaleString("ko-KR")

  return (
    <section className="moon-section" aria-label="달 상태">
      <div
        className="moon"
        data-power={power ? "on" : "off"}
        style={{ "--level": level } as MoonStyle}
        role="img"
        aria-label={power ? `달 밝기 ${brightness}%` : "달 꺼짐"}
      >
        <img src="/images/moon.webp" alt="" />
      </div>
      <p className="sensor-value t-value">{formattedValue}</p>
    </section>
  )
}
