/**
 * @fileoverview Type definitions for @kkhay/react
 * @license MIT
 */

export type PaymentStatus =
  | "idle"
  | "creating"
  | "pending"
  | "confirming"
  | "paid"
  | "confirmed"
  | "partial"
  | "expired"
  | "cancelled"
  | "failed";

export type KkhayTheme = "dark" | "light" | "system";

export type CryptoNetwork = "bsc" | "polygon" | "arbitrum" | "base" | "ethereum";
export type CryptoToken = "USDT" | "USDC" | "BNB" | "ETH";

export interface KkhayConfig {
  /**
   * K Khay Merchant API Key.
   */
  apiKey: string;

  /**
   * Base API endpoint.
   * @default "https://api.kkhay.com"
   */
  baseUrl?: string;

  /**
   * Default currency.
   * @default "USD"
   */
  defaultCurrency?: string;

  /**
   * Theme mode.
   * @default "system"
   */
  theme?: KkhayTheme;

  /**
   * Polling interval in milliseconds for invoice payment status.
   * @default 3000
   */
  pollingInterval?: number;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
}

export interface CreateInvoiceOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  title?: string;
  description?: string;
  customer?: CustomerInfo;
  metadata?: Record<string, unknown>;
  returnUrl?: string;
}

export interface InvoiceData {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus | string;
  checkoutUrl: string;
  depositAddress?: string;
  network?: CryptoNetwork | string;
  amountPaid?: number;
  txHash?: string;
  createdAt: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface KkhayContextValue {
  apiKey: string;
  baseUrl: string;
  defaultCurrency: string;
  theme: KkhayTheme;
  createInvoice: (options: CreateInvoiceOptions) => Promise<InvoiceData>;
  getInvoice: (id: string) => Promise<InvoiceData>;
}

export interface KkhayCheckoutModalProps {
  /**
   * Whether the modal is open.
   */
  isOpen: boolean;

  /**
   * Callback fired when closing the modal.
   */
  onClose: () => void;

  /**
   * Initial invoice data, or options to automatically generate one upon opening.
   */
  invoice?: InvoiceData | null;

  /**
   * Invoice generation parameters if modal generates invoice on open.
   */
  invoiceOptions?: CreateInvoiceOptions;

  /**
   * Callback fired upon confirmed on-chain payment.
   */
  onSuccess?: (invoice: InvoiceData) => void;

  /**
   * Callback fired on payment error or expiration.
   */
  onError?: (error: Error) => void;

  /**
   * Modal theme override.
   */
  theme?: KkhayTheme;
}

export type ButtonVariant = "default" | "outline" | "ghost" | "glass";
export type ButtonSize = "sm" | "default" | "lg";

export interface KkhayPayButtonProps {
  /**
   * Payment amount (e.g. 29.99).
   */
  amount: number;

  /**
   * Currency code (e.g. "USD", "EUR", "USDT").
   * @default "USD"
   */
  currency?: string;

  /**
   * Optional custom title for invoice.
   */
  title?: string;

  /**
   * Optional purchase description.
   */
  description?: string;

  /**
   * Optional reference or order ID.
   */
  orderId?: string;

  /**
   * Customer details.
   */
  customer?: CustomerInfo;

  /**
   * Custom metadata.
   */
  metadata?: Record<string, unknown>;

  /**
   * Button styling variant.
   * @default "default"
   */
  variant?: ButtonVariant;

  /**
   * Button size.
   * @default "default"
   */
  size?: ButtonSize;

  /**
   * Custom button label.
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Whether button is disabled.
   */
  disabled?: boolean;

  /**
   * Callback when payment completes successfully.
   */
  onSuccess?: (invoice: InvoiceData) => void;

  /**
   * Callback if payment fails.
   */
  onError?: (error: Error) => void;
}

