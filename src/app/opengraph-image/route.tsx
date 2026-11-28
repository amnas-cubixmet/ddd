export const dynamic = "force-static";

import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };


export function GET() {
  return new ImageResponse(
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center",
      width: "100%", height: "100%", padding: 84,
      color: "white", background: "linear-gradient(135deg, #0B2E57, #1F73BD)",
    }}>
      <div style={{ fontSize: 32, letterSpacing: 5 }}>BHARAT LUMS</div>
      <div style={{ marginTop: 26, fontSize: 77, maxWidth: 950, fontWeight: 700 }}>Powering a Brighter Tomorrow</div>
    </div>,
    size,
  );
}
