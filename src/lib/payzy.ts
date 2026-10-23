/** Added to the Payzy charge only. The checkout total does not show this rate. */
export const PAYZY_FEE_RATE = 0.12;

/** (item price + item price × 12%) / 4. Same figure Payzy collects, split into 4. */
export function payzyInstallmentEach(goods: number, freight = 0): number | null {
  if (!Number.isFinite(goods) || goods <= 0) return null;
  const payable = (goods + Math.max(0, freight)) * (1 + PAYZY_FEE_RATE);
  const each = payable / 4;
  return each > 0 ? each : null;
}

export function formatPayzyEach(each: number): string {
  return `LKR ${each.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
