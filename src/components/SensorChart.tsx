import { useEffect, useMemo, useRef, useState } from "react"
import type { Reading } from "../lib/device"
import { SENSOR_MAX } from "../product"

type SensorChartProps = {
  readings: Reading[]
}

const HEIGHT = 200
const MARGIN = { left: 40, right: 8, top: 8, bottom: 20 }

export function SensorChart({ readings }: SensorChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(320)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateWidth = () => setWidth(Math.max(element.clientWidth, 1))
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 1)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const points = useMemo(
    () =>
      readings
        .map((reading, index) => {
          const x =
            readings.length === 1
              ? MARGIN.left + plotWidth
              : MARGIN.left + (index / (readings.length - 1)) * plotWidth
          const level = Math.min(1, Math.max(0, reading.value / SENSOR_MAX))
          const y = MARGIN.top + (1 - level) * plotHeight
          return `${x},${y}`
        })
        .join(" "),
    [plotHeight, plotWidth, readings],
  )

  const currentValue = readings.at(-1)?.value
  const ariaLabel =
    currentValue === undefined
      ? "센서값 추이, 현재 값 없음"
      : `센서값 추이, 현재 ${currentValue.toLocaleString("ko-KR")}`

  return (
    <section className="chart-section" aria-label="실시간 센서값">
      <div className="chart-container" ref={containerRef}>
        {readings.length === 0 ? (
          <p className="chart-empty t-body">
            센서를 연결하면 값이 여기에 그려집니다.
          </p>
        ) : (
          <svg
            className="sensor-chart"
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            role="img"
            aria-label={ariaLabel}
          >
            {[0, SENSOR_MAX / 2, SENSOR_MAX].map((tick) => {
              const y = MARGIN.top + (1 - tick / SENSOR_MAX) * plotHeight
              return (
                <g key={tick}>
                  <line
                    className="chart-grid"
                    x1={MARGIN.left}
                    x2={width - MARGIN.right}
                    y1={y}
                    y2={y}
                  />
                  <text
                    className="chart-label"
                    x={MARGIN.left - MARGIN.right}
                    y={y + 4}
                    textAnchor="end"
                  >
                    {Math.round(tick).toLocaleString("ko-KR")}
                  </text>
                </g>
              )
            })}
            <polyline className="chart-line" points={points} />
            <text className="chart-label" x={MARGIN.left} y={HEIGHT - 2}>
              −60s
            </text>
            <text
              className="chart-label"
              x={width - MARGIN.right}
              y={HEIGHT - 2}
              textAnchor="end"
            >
              지금
            </text>
          </svg>
        )}
      </div>
    </section>
  )
}
