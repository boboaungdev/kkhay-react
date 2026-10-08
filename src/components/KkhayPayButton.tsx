/**
 * @fileoverview Drop-in Linear SaaS Crypto Checkout Button for @kkhay/react
 * @license MIT
 */

import React, { useState } from "react";
import { KkhayCheckoutModal } from "./KkhayCheckoutModal.js";
import type { InvoiceData, KkhayPayButtonProps } from "../types/index.js";

export function KkhayPayButton({
  amount,
  currency = "USD",
  title,
  description,
  orderId,
  customer,
  metadata,
  variant = "default",
  size = "default",
  children,
  className = "",
  disabled = false,
  onSuccess,
  onError,
}: KkhayPayButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClass =
    size === "sm"
      ? "kkhay-btn-sm"
      : size === "lg"
      ? "kkhay-btn-lg"
      : "kkhay-btn-default-size";

  const variantClass = `kkhay-btn-${variant}`;

  const formattedAmount = Number(amount).toFixed(2);

  const handleSuccess = (invoice: InvoiceData) => {
    onSuccess?.(invoice);
  };

  const handleError = (error: Error) => {
    onError?.(error);
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsModalOpen(true)}
        className={`kkhay-pay-button ${variantClass} ${sizeClass} ${className}`.trim()}
      >
        {children ? (
          children
        ) : (
          <>
            {/* K Khay Emerald Shield Emblem */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>

            <span>
              Pay ${formattedAmount} {currency.toUpperCase()} with Crypto
            </span>

            {/* Chevron Right */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.8 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </>
        )}
      </button>

      {/* Embedded Checkout Modal */}
      <KkhayCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceOptions={{
          amount,
          currency,
          title,
          description,
          orderId,
          customer,
          metadata,
        }}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}

