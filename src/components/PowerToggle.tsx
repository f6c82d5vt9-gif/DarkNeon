import { useState } from "react"

type PowerToggleProps = {
  power: boolean
  onChange: (nextPower: boolean) => Promise<boolean>
}

export function PowerToggle({ power, onChange }: PowerToggleProps) {
  const [failed, setFailed] = useState(false)

  async function handleToggle() {
    setFailed(false)
    const succeeded = await onChange(!power)
    setFailed(!succeeded)
  }

  return (
    <div>
      <div className="control-row">
        <div>
          <p className="control-name t-label">LED 전원</p>
          <p className="power-state t-caption">{power ? "켜짐" : "꺼짐"}</p>
        </div>
        <button
          className="power-toggle"
          type="button"
          role="switch"
          aria-checked={power}
          aria-label="LED 전원"
          data-power={power ? "on" : "off"}
          onClick={() => void handleToggle()}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      {failed && (
        <p className="power-error t-caption">전원 변경 실패, 다시 시도</p>
      )}
    </div>
  )
}
