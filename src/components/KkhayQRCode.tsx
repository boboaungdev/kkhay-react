/**
 * @fileoverview High-performance SVG QR Code Component powered by qrcode.react
 * @license MIT
 */

import React from "react";
import { QRCodeSVG } from "qrcode.react";

export interface KkhayQRCodeProps {
  /**
   * The checkout URL or deposit address to encode.
   */
  value: string;

  /**
   * The pixel width and height of the QR code.
   * @default 180
   */
  size?: number;

  /**
   * Whether to embed the center K Khay logo with automatic module excavation.
   * @default true
   */
  centerLogo?: boolean;

  /**
   * Optional custom logo URL or Data URI to embed in the center.
   */
  logoUrl?: string;

  /**
   * Optional additional CSS class name.
   */
  className?: string;
}

// Built-in emerald K Khay vector badge as zero-dependency SVG Data URI
const DEFAULT_KKHAY_BADGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44">
  <circle cx="22" cy="22" r="21" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
  <path d="M14 11v22M14 22l14-11M14 22l14 11" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

export function KkhayQRCode({
  value,
  size = 180,
  centerLogo = true,
  logoUrl,
  className = "",
}: KkhayQRCodeProps) {
  if (!value) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f4f5",
          borderRadius: "12px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#a1a1aa" }}>No QR data</span>
      </div>
    );
  }

  const logoDimension = Math.round(size * 0.24);

  const imageSettings = centerLogo
    ? {
        src: logoUrl || DEFAULT_KKHAY_BADGE,
        height: logoDimension,
        width: logoDimension,
        excavate: true, // Clears QR code modules behind the center emblem for instant scanning
      }
    : undefined;

  return (
    <div
      className={`kkhay-qr-wrapper ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        background: "#ffffff",
        borderRadius: 12,
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="H" // High error correction level for reliable camera scanning with center logo
        bgColor="#ffffff"
        fgColor="#09090b"
        imageSettings={imageSettings}
      />
    </div>
  );
}
