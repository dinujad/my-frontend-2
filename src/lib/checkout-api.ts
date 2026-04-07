import type { CartItem } from "@/stores/cart-store";

/** Same-origin: Next.js rewrites `/api/*` to Laravel (see next.config.ts). */
const CHECKOUT_PATH = "/api/v1/checkout";

function safeFileKeyPart(label: string): string {
  return label.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120) || "file";
}

export type CheckoutSuccess = {
  message: string;
  order_id: number;
  order_number: string;
  payment_method?: string;
  token?: string;
  user?: any;
};

export async function submitOrder(
  form: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_district?: string;
    notes?: string;
    register?: boolean;
    password?: string;
    shipping_method_id?: number;
    shipping_cost?: number;
    payment_method?: string;
  },
  cartItems: CartItem[]
): Promise<CheckoutSuccess> {
  const itemsPayload = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    customization_fee: item.customization_fee,
    customizations: item.customizations ?? {},
    product_variation_id: item.variation_id ?? null,
    variation_id: item.variation_id ?? null,
    product_name: item.name,
  }));

  const body = new FormData();
  body.append("customer_name", form.customer_name.trim());
  body.append("customer_email", form.customer_email.trim());
  body.append("customer_phone", form.customer_phone.trim());
  body.append("customer_address", form.customer_address.trim());
  if (form.customer_district?.trim()) {
    body.append("customer_district", form.customer_district.trim());
  }
  if (form.shipping_method_id) {
    body.append("shipping_method_id", String(form.shipping_method_id));
  }
  if (form.shipping_cost !== undefined) {
    body.append("shipping_cost", String(form.shipping_cost));
  }
  if (form.payment_method) {
    body.append("payment_method", form.payment_method);
  }
  if (form.notes?.trim()) {
    body.append("notes", form.notes.trim());
  }
  if (form.register) {
    body.append("register", "1");
    body.append("password", form.password ?? "");
  }
  body.append("items", JSON.stringify(itemsPayload));

  cartItems.forEach((item, index) => {
    item.customization_files?.forEach((cf) => {
      const key = `item_${index}_file_${safeFileKeyPart(cf.label)}`;
      body.append(key, cf.file);
    });
  });

  const res = await fetch(CHECKOUT_PATH, {
    method: "POST",
    body,
  });

  const data = (await res.json().catch(() => ({}))) as CheckoutSuccess & {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!res.ok) {
    if (data.errors && typeof data.errors === "object") {
      const first = Object.values(data.errors).flat()[0];
      if (typeof first === "string") throw new Error(first);
    }
    const msg =
      typeof data.message === "string"
        ? data.message
        : `Order failed (${res.status})`;
    throw new Error(msg);
  }

  return data as CheckoutSuccess;
}
