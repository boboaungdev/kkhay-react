# @kkhay/react

[![npm version](https://img.shields.io/npm/v/@kkhay/react.svg?color=10b981)](https://www.npmjs.com/package/@kkhay/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%26%2019-61DAFB.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20%26%2015-black.svg)](https://nextjs.org/)

The official **React & Next.js** crypto checkout modal and UI SDK for **[K Khay](https://kkhay.com)**.

Accept non-custodial and custodial crypto payments (**USDT, USDC, BNB, ETH** across **BNB Smart Chain, Polygon, Arbitrum, Base, and Ethereum**) directly in your web applications with **instant on-chain verification** and **zero chargebacks**.

---

## 🌟 Features

* **Linear / Modern SaaS Aesthetic**: Designed with subtle frosted glass surfaces (`backdrop-blur-md`), crisp borders, and dark/light mode support.
* **Next.js App Router Native**: Full support for Next.js 14 and 15 Server Components via pre-bundled `"use client"` directives.
* **Zero CSS Conflicts**: Clean scoped classes (`kkhay-*`) that work effortlessly with Tailwind CSS, Vanilla CSS, or CSS Modules.
* **Drop-in `<KkhayPayButton />`**: Single-line integration that automatically mounts and manages the checkout modal.
* **Dynamic High-Resolution QR Codes**: Built-in SVG QR code rendering with the official K Khay center emblem.
* **Live Blockchain Listener**: Automatically polls payment status and transitions to the confirmed state upon on-chain settlement.
* **Headless Hook (`useKkhayPayment`)**: Full UI control for developers building completely bespoke checkout interfaces.

---

## 📦 Installation

```bash
# npm
npm install @kkhay/react

# pnpm
pnpm add @kkhay/react

# yarn
yarn add @kkhay/react
```

---

## 🚀 Quickstart: Drop-in Checkout Button

Import the styles and wrap your application (or checkout page) in `<KkhayProvider>`:

```tsx
import { KkhayProvider, KkhayPayButton } from "@kkhay/react";
import "@kkhay/react/styles.css";

export default function CheckoutPage() {
  return (
    <KkhayProvider apiKey="kkhay_pk_live_your_api_key_here">
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Upgrade to Pro</h1>
        <p>Unlock all features for $29.99 / month</p>

        {/* Drop-in Payment Button */}
        <KkhayPayButton
          amount={29.99}
          currency="USD"
          title="Pro Plan Subscription"
          variant="default"
          onSuccess={(invoice) => {
            console.log("Payment confirmed on-chain! Tx:", invoice.txHash);
            alert("Payment successful! Welcome to Pro.");
          }}
          onError={(err) => {
            console.error("Payment error:", err);
          }}
        />
      </div>
    </KkhayProvider>
  );
}
```

---

## 💎 Custom Modal Integration

If you want to trigger the checkout modal from your own custom buttons or workflows:

```tsx
"use client";

import { useState } from "react";
import { KkhayProvider, KkhayCheckoutModal } from "@kkhay/react";
import "@kkhay/react/styles.css";

export function CustomPaymentFlow() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <KkhayProvider apiKey="kkhay_pk_live_your_key">
      <button onClick={() => setIsOpen(true)}>
        Custom Buy Button
      </button>

      <KkhayCheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        invoiceOptions={{
          amount: 50.00,
          currency: "USD",
          title: "Credits Purchase",
        }}
        onSuccess={(invoice) => {
          setIsOpen(false);
          // Redirect or update user balance
        }}
      />
    </KkhayProvider>
  );
}
```

---

## 🧠 Headless Hook (`useKkhayPayment`)

Build your own completely custom UI using the headless state machine:

```tsx
"use client";

import { useKkhayPayment } from "@kkhay/react";

export function BespokeCheckout() {
  const {
    status,        // 'idle' | 'creating' | 'pending' | 'paid' | 'expired'
    invoice,       // Current invoice data (checkoutUrl, amount, etc.)
    timeLeft,      // '14:45' countdown string
    startPayment,  // Function to create invoice
    isPaid,        // Boolean
  } = useKkhayPayment();

  const handlePay = () => {
    startPayment({ amount: 10, currency: "USD" });
  };

  if (isPaid) return <div>🎉 Payment confirmed!</div>;

  return (
    <div>
      <button onClick={handlePay}>Pay $10</button>
      {status === "pending" && (
        <div>
          <p>Scan to pay: {invoice?.checkoutUrl}</p>
          <p>Time remaining: {timeLeft}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 Component Props

### `<KkhayPayButton />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `amount` | `number` | **Required** | The payment amount. |
| `currency` | `string` | `"USD"` | 3-letter currency code. |
| `title` | `string` | `"Checkout"` | Invoice title. |
| `variant` | `"default" \| "outline" \| "ghost" \| "glass"` | `"default"` | Linear-styled button variant. |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Button sizing. |
| `onSuccess` | `(invoice) => void` | `undefined` | Callback fired on confirmed settlement. |
| `onError` | `(err) => void` | `undefined` | Callback fired on error. |

### `<KkhayCheckoutModal />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | **Required** | Whether the modal dialog is open. |
| `onClose` | `() => void` | **Required** | Close handler. |
| `invoiceOptions`| `CreateInvoiceOptions` | `undefined` | Options to automatically generate invoice. |
| `theme` | `"dark" \| "light" \| "system"` | `"dark"` | Color theme mode. |
| `onSuccess` | `(invoice) => void` | `undefined` | Callback fired on confirmed settlement. |

---

## 📄 License

This library is licensed under the [MIT License](LICENSE).

---

## 💬 Community & Support

* **Website**: [https://kkhay.com](https://kkhay.com)
* **GitHub Issues**: [https://github.com/boboaungdev/kkhay-react/issues](https://github.com/boboaungdev/kkhay-react/issues)
* **Telegram**: [@kkhaysupport](https://t.me/kkhay)

