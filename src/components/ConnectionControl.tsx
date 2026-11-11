import type { Status } from "../lib/device"

type ConnectionControlProps = {
  status: Status
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
}

const STATUS_LABELS: Record<Status, string> = {
  disconnected: "연결 안 됨",
  connecting: "연결 중…",
  connected: "연결됨",
  error: "연결 실패, 다시 시도",
}

export function ConnectionControl({
  status,
  onConnect,
  onDisconnect,
}: ConnectionControlProps) {
  const connected = status === "connected"
  const connecting = status === "connecting"

  return (
    <div className="control-row">
      <div>
        <p className="control-name t-label">센서</p>
        <p
          className={`connection-status connection-status--${status} t-label`}
          role="status"
        >
          <span className="status-dot" aria-hidden="true" />
          {STATUS_LABELS[status]}
        </p>
      </div>
      <button
        className={`connection-button connection-button--${
          connected ? "disconnect" : "connect"
        } t-label`}
        type="button"
        disabled={connecting}
        onClick={() => void (connected ? onDisconnect() : onConnect())}
      >
        {connected ? "연결 끊기" : "센서 연결"}
      </button>
    </div>
  )
}
