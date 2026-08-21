import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "AN Apartment";
  const subtitle =
    searchParams.get("subtitle") ??
    "Rooms & Apartments for Rent in Son Tra, Da Nang";
  const type = searchParams.get("type"); // "room" | "apartment" | null

  // Badge label
  const badge =
    type === "apartment" ? "Apartment" : type === "room" ? "Room" : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%, #ecfdf5 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(55, 132, 81, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(55, 132, 81, 0.06)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "64px 80px",
            position: "relative",
          }}
        >
          {/* Top — logo + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#378451",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 22V12l6-4 6 4v10" />
                <path d="M6 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
                <path d="M10 22v-4h4v4" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#378451",
                letterSpacing: "-0.5px",
              }}
            >
              AN Apartment
            </span>

            {badge && (
              <div
                style={{
                  marginLeft: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 6,
                  paddingBottom: 6,
                  borderRadius: 999,
                  background: "#dcfce7",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#378451",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {badge}
              </div>
            )}
          </div>

          {/* Middle — main title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 860,
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? 52 : 64,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 26,
                color: "#6b7280",
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom — address + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#6b7280",
                fontSize: 20,
              }}
            >
              {/* MapPin icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              75 Luong Huu Khanh, Son Tra, Da Nang
            </div>

            <div
              style={{
                paddingLeft: 28,
                paddingRight: 28,
                paddingTop: 14,
                paddingBottom: 14,
                borderRadius: 999,
                background: "#378451",
                color: "white",
                fontSize: 20,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              listing-psi.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
