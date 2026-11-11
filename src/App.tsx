import { useEffect, useState } from "react"
import { ConnectionControl } from "./components/ConnectionControl"
import { PowerToggle } from "./components/PowerToggle"
import { ProductHeader } from "./components/ProductHeader"
import { SensorChart } from "./components/SensorChart"
import { SensorMoon } from "./components/SensorMoon"
import {
  connectSensor,
  disconnectSensor,
  loadPower,
  setLedPower,
  type Reading,
  type Status,
} from "./lib/device"
import { MAX_POINTS } from "./product"

export default function App() {
  const [status, setStatus] = useState<Status>("disconnected")
  const [power, setPower] = useState(false)
  const [readings, setReadings] = useState<Reading[]>([])

  useEffect(() => {
    void loadPower().then(setPower)
    return () => {
      void disconnectSensor()
    }
  }, [])

  async function handleConnect() {
    await connectSensor({
      onInit: setReadings,
      onReading: (row) => {
        setReadings((current) => [...current, row].slice(-MAX_POINTS))
      },
      onStatus: setStatus,
    })
  }

  async function handleDisconnect() {
    await disconnectSensor()
    setStatus("disconnected")
  }

  async function handlePowerChange(nextPower: boolean) {
    const previousPower = power
    setPower(nextPower)
    const succeeded = await setLedPower(nextPower)
    if (!succeeded) setPower(previousPower)
    return succeeded
  }

  return (
    <main className="app-shell">
      <ProductHeader />
      <SensorMoon value={readings.at(-1)?.value} power={power} />
      <div className="lower-grid">
        <section className="controls-section" aria-label="조명 제어">
          <ConnectionControl
            status={status}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <PowerToggle power={power} onChange={handlePowerChange} />
        </section>
        <SensorChart readings={readings} />
      </div>
    </main>
  )
}
