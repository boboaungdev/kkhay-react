/**
 * @fileoverview Lightweight API client for @kkhay/react
 * @license MIT
 */

import type { CreateInvoiceOptions, InvoiceData } from "./types/index.js";

export class KkhayApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://api.kkhay.com") {
    this.apiKey = apiKey.trim();
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private buildUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (this.baseUrl.endsWith("/api") || this.baseUrl.includes("api.")) {
      return `${this.baseUrl}${cleanPath}`;
    }
    return `${this.baseUrl}/api${cleanPath}`;
  }

  public async createInvoice(options: CreateInvoiceOptions): Promise<InvoiceData> {
    const currency = (options.currency || options.priceCurrency || "USD").toUpperCase();
    const amount = Number(options.amount ?? options.priceAmount ?? 0);

    const payload = {
      orderId: options.orderId || `web_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount,
      priceAmount: amount,
      currency,
      priceCurrency: currency,
      payNetwork: options.payNetwork ? options.payNetwork.toLowerCase() : undefined,
      payToken: options.payToken ? options.payToken.toUpperCase() : undefined,
      title: options.title || "Checkout",
      description: options.description,
      customer: options.customer,
      metadata: {
        source: "react-sdk",
        ...options.metadata,
      },
      redirectUrl: options.redirectUrl || options.returnUrl || (typeof window !== "undefined" ? window.location.href : undefined),
      cancelUrl: options.cancelUrl,
    };

    const res = await fetch(this.buildUrl("/v1/gateway/invoices"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "User-Agent": "@kkhay/react/1.0.4",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || data?.error || `Failed to create invoice (${res.status})`);
    }

    const rawInvoice = data.invoice || data.data || data;
    const checkoutUrl = rawInvoice.hostedUrl || rawInvoice.checkoutUrl || "";

    return {
      ...rawInvoice,
      checkoutUrl,
      hostedUrl: checkoutUrl,
      amount: Number(rawInvoice.amount ?? rawInvoice.priceAmount ?? amount),
      currency: (rawInvoice.currency || rawInvoice.priceCurrency || currency).toUpperCase(),
    } as InvoiceData;
  }

  public async getInvoice(id: string): Promise<InvoiceData> {
    const res = await fetch(this.buildUrl(`/v1/gateway/invoices/${encodeURIComponent(id.trim())}`), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": this.apiKey,
        "User-Agent": "@kkhay/react/1.0.4",
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || data?.error || `Failed to fetch invoice (${res.status})`);
    }

    const rawInvoice = data.invoice || data.data || data;
    const checkoutUrl = rawInvoice.hostedUrl || rawInvoice.checkoutUrl || "";

    return {
      ...rawInvoice,
      checkoutUrl,
      hostedUrl: checkoutUrl,
      amount: Number(rawInvoice.amount ?? rawInvoice.priceAmount ?? 0),
      currency: (rawInvoice.currency || rawInvoice.priceCurrency || "USD").toUpperCase(),
    } as InvoiceData;
  }

  public async checkHealth(): Promise<{ status: string }> {
    const res = await fetch(this.buildUrl("/health"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "@kkhay/react/1.0.4",
      },
    });
    return res.json();
  }
}
