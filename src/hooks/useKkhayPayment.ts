/**
 * @fileoverview Headless payment hook for @kkhay/react
 * @license MIT
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useKkhay } from "../components/KkhayProvider.js";
import type { CreateInvoiceOptions, InvoiceData, PaymentStatus } from "../types/index.js";

export interface UseKkhayPaymentOptions {
  pollingInterval?: number;
  onSuccess?: (invoice: InvoiceData) => void;
  onError?: (error: Error) => void;
}

export function useKkhayPayment(options: UseKkhayPaymentOptions = {}) {
  const { createInvoice: apiCreate, getInvoice: apiGet } = useKkhay();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("15:00");

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingInterval = options.pollingInterval || 3000;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const checkStatus = useCallback(async () => {
    if (!invoice?.id) return;
    try {
      const updated = await apiGet(invoice.id);
      const rawStatus = (updated.status || "").toString().toUpperCase();

      setInvoice(updated);

      if (rawStatus === "PAID" || rawStatus === "CONFIRMED") {
        setStatus("paid");
        if (pollingRef.current) clearInterval(pollingRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        options.onSuccess?.(updated);
      } else if (rawStatus === "EXPIRED" || rawStatus === "CANCELED" || rawStatus === "CANCELLED") {
        setStatus("expired");
        if (pollingRef.current) clearInterval(pollingRef.current);
      } else if (rawStatus === "WAITING" || rawStatus === "PENDING") {
        setStatus("pending");
      } else if (rawStatus === "CONFIRMING") {
        setStatus("confirming");
      } else if (rawStatus === "PARTIAL") {
        setStatus("partial");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("K Khay status poll error:", msg);
    }
  }, [invoice?.id, apiGet, options]);

  // Polling loop
  useEffect(() => {
    if (status === "pending" || status === "confirming") {
      pollingRef.current = setInterval(checkStatus, pollingInterval);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
  }, [status, pollingInterval, checkStatus]);

  // Expiry countdown timer (15 minutes default)
  useEffect(() => {
    if (!invoice) return;

    const expiresAt = invoice.expiresAt
      ? new Date(invoice.expiresAt).getTime()
      : new Date(invoice.createdAt || Date.now()).getTime() + 15 * 60 * 1000;

    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));

      if (diff <= 0) {
        setTimeLeft("00:00");
        setStatus("expired");
        if (countdownRef.current) clearInterval(countdownRef.current);
        return;
      }

      const m = Math.floor(diff / 60)
        .toString()
        .padStart(2, "0");
      const s = (diff % 60).toString().padStart(2, "0");
      setTimeLeft(`${m}:${s}`);
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [invoice]);

  const startPayment = useCallback(
    async (createOptions: CreateInvoiceOptions): Promise<InvoiceData> => {
      setStatus("creating");
      setError(null);

      try {
        const inv = await apiCreate(createOptions);
        setInvoice(inv);
        setStatus("pending");

        // Initialize countdown time display cleanly without effect cascading render
        const expiresAt = inv.expiresAt
          ? new Date(inv.expiresAt).getTime()
          : Date.now() + 15 * 60 * 1000;
        const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        const m = Math.floor(diff / 60).toString().padStart(2, "0");
        const s = (diff % 60).toString().padStart(2, "0");
        setTimeLeft(`${m}:${s}`);

        return inv;
      } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setStatus("failed");
        options.onError?.(errorObj);
        throw errorObj;
      }
    },
    [apiCreate, options]
  );

  const reset = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setStatus("idle");
    setInvoice(null);
    setError(null);
    setTimeLeft("15:00");
  }, []);

  return {
    status,
    invoice,
    error,
    timeLeft,
    isPaid: status === "paid",
    isExpired: status === "expired",
    isLoading: status === "creating",
    startPayment,
    checkStatus,
    reset,
  };
}
