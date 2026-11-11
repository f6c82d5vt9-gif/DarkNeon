import { useEffect } from "react"
import { IS_DEMO } from "../lib/supabase"
import { PRODUCT } from "../product"

export function ProductHeader() {
  useEffect(() => {
    document.title = PRODUCT.name
  }, [])

  return (
    <header className="product-header">
      <h1 className="t-display">{PRODUCT.name || "[제품 이름]"}</h1>
      <p className="product-concept t-label">
        {PRODUCT.concept || "[제품 컨셉, 한 줄]"}
      </p>
      <p className="product-description t-body">
        {PRODUCT.description || "[제품 설명, 2~3문장]"}
      </p>
      {IS_DEMO && <p className="demo-note t-caption">데모 데이터로 표시 중</p>}
    </header>
  )
}
