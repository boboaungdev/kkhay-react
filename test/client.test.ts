import { describe, it, expect } from "vitest";
import { KkhayApiClient } from "../src/client.js";

describe("KkhayApiClient", () => {
  it("should initialize with API key", () => {
    const client = new KkhayApiClient("test_pk_123");
    expect(client).toBeDefined();
  });

  it("should strip trailing slashes in baseUrl", () => {
    const client = new KkhayApiClient("test_pk_123", "https://api.kkhay.com/");
    expect((client as any).baseUrl).toBe("https://api.kkhay.com");
  });
});

