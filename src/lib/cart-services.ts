/** How additional service price is applied at checkout */
export type AdditionalServicePricingType = "per_item" | "per_order";

export type CartAdditionalService = {
  id: number;
  name: string;
  price: number;
  pricing_type?: AdditionalServicePricingType;
};

export function splitAdditionalServiceFees(services: CartAdditionalService[] | undefined): {
  perItem: number;
  perOrder: number;
} {
  let perItem = 0;
  let perOrder = 0;
  for (const s of services ?? []) {
    const p = Number(s.price) || 0;
    if (s.pricing_type === "per_order") {
      perOrder += p;
    } else {
      perItem += p;
    }
  }
  return { perItem, perOrder };
}

/** Total add-on services amount for a cart line (respects per_item vs per_order). */
export function additionalServicesTotal(
  services: CartAdditionalService[] | undefined,
  quantity: number,
  legacyPerUnitFee = 0
): number {
  const { perItem, perOrder } = splitAdditionalServiceFees(services);
  const itemPart = (services?.length ? perItem : legacyPerUnitFee) * quantity;
  return itemPart + perOrder;
}

export function cartLineTotal(item: {
  price: number;
  customization_fee: number;
  quantity: number;
  additional_services?: CartAdditionalService[];
  additional_services_fee?: number;
}): number {
  const productPart = (item.price + item.customization_fee) * item.quantity;
  const servicesPart = additionalServicesTotal(
    item.additional_services,
    item.quantity,
    item.additional_services_fee ?? 0
  );
  return productPart + servicesPart;
}

export function pricingTypeLabel(type: AdditionalServicePricingType | undefined): string {
  return type === "per_order" ? "once per order" : "per item";
}
