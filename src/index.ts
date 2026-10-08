/**
 * @fileoverview Main entrypoint for @kkhay/react
 * @license MIT
 */

export { KkhayProvider, useKkhay } from "./components/KkhayProvider.js";
export { KkhayCheckoutModal } from "./components/KkhayCheckoutModal.js";
export { KkhayPayButton } from "./components/KkhayPayButton.js";
export { KkhayQRCode } from "./components/KkhayQRCode.js";

export { useKkhayPayment } from "./hooks/useKkhayPayment.js";
export { KkhayApiClient } from "./client.js";

export type {
  PaymentStatus,
  KkhayTheme,
  CryptoNetwork,
  CryptoToken,
  KkhayConfig,
  CustomerInfo,
  CreateInvoiceOptions,
  InvoiceData,
  KkhayContextValue,
  KkhayCheckoutModalProps,
  ButtonVariant,
  ButtonSize,
  KkhayPayButtonProps,
} from "./types/index.js";

export type { KkhayQRCodeProps } from "./components/KkhayQRCode.js";
export type { KkhayProviderProps } from "./components/KkhayProvider.js";
export type { UseKkhayPaymentOptions } from "./hooks/useKkhayPayment.js";

