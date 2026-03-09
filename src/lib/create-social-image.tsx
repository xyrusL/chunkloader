import { ImageResponse } from "next/og";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site-config";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

export function createSocialImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "radial-gradient(circle at 18% 24%, rgba(52,211,153,0.22), transparent 22%), radial-gradient(circle at 80% 18%, rgba(64,86,214,0.22), transparent 24%), linear-gradient(180deg, #08111D 0%, #0B1320 45%, #09111A 100%)",
          color: "#FFFFFF",
          padding: "48px",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.09)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "120px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 132px)",
            gap: "16px",
            transform: "rotate(-12deg)",
            opacity: 0.9,
          }}
        >
          {["#1AA56E", "#2A6EAC", "#4F62DB", "#20C997", "#F68A3C", "#E0D36C", "#7E70FF", "#2AD5C5", "#44607E"].map((color, index) => (
            <div
              key={index}
              style={{
                width: "132px",
                height: "132px",
                borderRadius: "24px",
                background: color,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "rgba(52,211,153,0.14)",
                border: "1px solid rgba(52,211,153,0.32)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34D399",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              C
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ color: "#34D399", fontSize: "20px", letterSpacing: "0.34em", textTransform: "uppercase" }}>
                {SITE_NAME}
              </div>
              <div style={{ color: "#A7B4C4", fontSize: "18px" }}>{SITE_DOMAIN}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "760px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(16,185,129,0.16)",
                color: "#34D399",
                fontSize: "18px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
            <div style={{ fontSize: "66px", lineHeight: 1.02, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: "28px", lineHeight: 1.4, color: "#D1D5DB", maxWidth: "720px" }}>{subtitle}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#8EA0B3", fontSize: "22px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "999px",
                background: "#34D399",
                boxShadow: "0 0 0 10px rgba(52,211,153,0.12)",
              }}
            />
            Interactive biome maps, structure previews, version-aware seed exploration
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}
