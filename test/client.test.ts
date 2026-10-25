import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { KkhayApiClient } from "../src/client.js";

describe("KkhayApiClient", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should initialize with API key and default options", () => {
    const client = new KkhayApiClient("test_pk_123");
    expect(client).toBeDefined();
    expect((client as any).apiKey).toBe("test_pk_123");
    expect((client as any).baseUrl).toBe("https://api.kkhay.com");
  });

  it("should strip trailing slashes in baseUrl", () => {
    const client = new KkhayApiClient("test_pk_123", "https://api.kkhay.com/");
    expect((client as any).baseUrl).toBe("https://api.kkhay.com");
  });

  it("should format URLs correctly", () => {
    const api = new KkhayApiClient("key", "https://api.kkhay.com");
    expect((api as any).buildUrl("/v1/gateway/invoices")).toBe("https://api.kkhay.com/v1/gateway/invoices");
    expect((api as any).buildUrl("v1/gateway/invoices")).toBe("https://api.kkhay.com/v1/gateway/invoices");

    const custom = new KkhayApiClient("key", "https://gateway.internal");
    expect((custom as any).buildUrl("/v1/gateway/invoices")).toBe("https://gateway.internal/api/v1/gateway/invoices");
  });

  it("should send createInvoice request to /v1/gateway/invoices", async () => {
    const mockResponse = {
      ok: true,
      invoice: {
        id: "0192e2b3-5776-791b-8524-77a834164b12",
        gatewayId: "gw_prod_001",
        amount: 49.99,
        currency: "USD",
        hostedUrl: "https://kkhay.com/gateway/invoice/0192e2b3-5776-791b-8524-77a834164b12",
        status: "WAITING",
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchMock;

    const client = new KkhayApiClient("kkhay_pk_live_123");
    const invoice = await client.createInvoice({
      amount: 49.99,
      currency: "usd",
      payNetwork: "BSC",
      payToken: "usdt",
      orderId: "ORD-1",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.kkhay.com/v1/gateway/invoices");
    expect(options.method).toBe("POST");
    expect(options.headers["x-api-key"]).toBe("kkhay_pk_live_123");
    expect(options.headers["User-Agent"]).toBe("@kkhay/react/1.0.4");

    const body = JSON.parse(options.body);
    expect(body.amount).toBe(49.99);
    expect(body.priceAmount).toBe(49.99);
    expect(body.currency).toBe("USD");
    expect(body.payNetwork).toBe("bsc");
    expect(body.payToken).toBe("USDT");
    expect(body.orderId).toBe("ORD-1");

    expect(invoice.id).toBe("0192e2b3-5776-791b-8524-77a834164b12");
    expect(invoice.hostedUrl).toBe("https://kkhay.com/gateway/invoice/0192e2b3-5776-791b-8524-77a834164b12");
    expect(invoice.checkoutUrl).toBe("https://kkhay.com/gateway/invoice/0192e2b3-5776-791b-8524-77a834164b12");
  });

  it("should send getInvoice request to /v1/gateway/invoices/:id", async () => {
    const mockResponse = {
      invoice: {
        id: "inv_999",
        gatewayId: "gw_001",
        amount: 25.0,
        currency: "USD",
        hostedUrl: "https://kkhay.com/gateway/invoice/inv_999",
        status: "PAID",
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchMock;

    const client = new KkhayApiClient("kkhay_key");
    const invoice = await client.getInvoice("inv_999");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.kkhay.com/v1/gateway/invoices/inv_999");
    expect(options.method).toBe("GET");
    expect(invoice.id).toBe("inv_999");
    expect(invoice.status).toBe("PAID");
  });

  it("should send checkHealth request to /health", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "ok" }),
    });
    globalThis.fetch = fetchMock;

    const client = new KkhayApiClient("kkhay_key");
    const res = await client.checkHealth();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.kkhay.com/health");
    expect(res.status).toBe("ok");
  });
});
