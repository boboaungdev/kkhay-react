/**
 * @fileoverview Linear-aesthetic Glassmorphism Crypto Checkout Modal for @kkhay/react
 * @license MIT
 */

import React, { useEffect, useState } from "react";
import { useKkhay } from "./KkhayProvider.js";
import { KkhayQRCode } from "./KkhayQRCode.js";
import { useKkhayPayment } from "../hooks/useKkhayPayment.js";
import type {
  CryptoNetwork,
  CryptoToken,
  InvoiceData,
  KkhayCheckoutModalProps,
} from "../types/index.js";

const NETWORKS: { id: CryptoNetwork; name: string; color: string }[] = [
  { id: "bsc", name: "BNB Smart Chain", color: "#f3ba2f" },
  { id: "polygon", name: "Polygon", color: "#8247e5" },
  { id: "arbitrum", name: "Arbitrum", color: "#28a0f0" },
  { id: "base", name: "Base", color: "#0052ff" },
  { id: "ethereum", name: "Ethereum", color: "#627eea" },
];

export function KkhayCheckoutModal({
  isOpen,
  onClose,
  invoice: initialInvoice,
  invoiceOptions,
  onSuccess,
  onError,
  theme: themeProp,
}: KkhayCheckoutModalProps) {
  const { theme: contextTheme } = useKkhay();
  const activeTheme = themeProp || contextTheme || "dark";

  const { status, invoice, timeLeft, startPayment, isPaid } = useKkhayPayment({
    onSuccess,
    onError,
  });

  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork>("bsc");
  const [selectedToken, setSelectedToken] = useState<CryptoToken>("USDT");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Generate invoice if options are passed and modal opens
  useEffect(() => {
    if (isOpen && invoiceOptions && !initialInvoice && status === "idle") {
      startPayment(invoiceOptions).catch(() => {});
    }
  }, [isOpen, invoiceOptions, initialInvoice, status, startPayment]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentInvoice = invoice || initialInvoice;
  const depositAddress =
    currentInvoice?.depositAddress || "0x71C...a47B2E3D98E56F9812C4"; // live address or hosted checkout address
  const checkoutUrl = currentInvoice?.checkoutUrl || "https://kkhay.com/pay";
  const amountStr = currentInvoice ? Number(currentInvoice.amount).toFixed(2) : "0.00";
  const currencyStr = currentInvoice?.currency || "USD";

  const copyToClipboard = (text: string, type: "address" | "amount") => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "address") {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      }
    }
  };

  return (
    <div
      className={`kkhay-modal-overlay kkhay-theme-${activeTheme}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="kkhay-modal-card">
        {/* Header */}
        <div className="kkhay-modal-header">
          <div className="kkhay-modal-title">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span>K Khay Crypto Checkout</span>
          </div>

          <button
            type="button"
            className="kkhay-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="kkhay-modal-body">
          {/* PAID SCREEN */}
          {isPaid ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
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
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: 18, fontWeight: 700 }}>
                  Payment Confirmed!
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--kkhay-text-muted)" }}>
                  Your crypto transaction has been verified on-chain.
                </p>
              </div>

              <div className="kkhay-bento-tile" style={{ width: "100%", flexDirection: "column", gap: 8, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 13 }}>
                  <span style={{ color: "var(--kkhay-text-muted)" }}>Amount Paid</span>
                  <span style={{ fontWeight: 600 }}>{amountStr} {currencyStr}</span>
                </div>
                {currentInvoice?.txHash && (
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 12 }}>
                    <span style={{ color: "var(--kkhay-text-muted)" }}>Tx Hash</span>
                    <span style={{ fontFamily: "monospace" }}>
                      {currentInvoice.txHash.slice(0, 8)}...{currentInvoice.txHash.slice(-6)}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="kkhay-pay-button kkhay-btn-default kkhay-btn-default-size"
                style={{ width: "100%", marginTop: 8 }}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          ) : (
            /* PAYMENT IN-PROGRESS VIEW */
            <>
              {/* Amount & Countdown Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 2px",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "var(--kkhay-text-muted)" }}>Amount Due</div>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                    ${amountStr} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--kkhay-text-muted)" }}>{currencyStr}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 20,
                    backgroundColor: "var(--kkhay-tile-bg)",
                    border: "1px solid var(--kkhay-tile-border)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{timeLeft}</span>
                </div>
              </div>

              {/* Network Selector Pills */}
              <div>
                <div style={{ fontSize: 12, color: "var(--kkhay-text-muted)", marginBottom: 6 }}>
                  Select Chain:
                </div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                  {NETWORKS.map((net) => (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedNetwork(net.id)}
                      style={{
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: selectedNetwork === net.id ? 600 : 400,
                        borderRadius: 8,
                        border: selectedNetwork === net.id ? "1px solid var(--kkhay-primary)" : "1px solid var(--kkhay-tile-border)",
                        backgroundColor: selectedNetwork === net.id ? "var(--kkhay-primary-soft)" : "transparent",
                        color: selectedNetwork === net.id ? "var(--kkhay-primary)" : "var(--kkhay-text-muted)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {net.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic QR Code Card */}
              <div className="kkhay-qr-container">
                <KkhayQRCode value={checkoutUrl} size={180} centerLogo />
              </div>

              {/* Deposit Address Box */}
              <div className="kkhay-bento-tile">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--kkhay-text-muted)", marginBottom: 2 }}>
                    Scan QR or Pay directly via Web:
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {checkoutUrl}
                  </div>
                </div>

                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kkhay-copy-pill"
                  style={{ textDecoration: "none" }}
                >
                  <span>Open</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>

              {/* Live Status Listener footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--kkhay-text-muted)",
                  paddingTop: 4,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span>Listening for blockchain confirmation...</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

