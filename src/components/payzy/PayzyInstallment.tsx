import { formatPayzyEach, payzyInstallmentEach } from "@/lib/payzy";

type Props = {
  goods: number;
  freight?: number;
  className?: string;
  logoClassName?: string;
};

export function PayzyInstallment({ goods, freight = 0, className = "", logoClassName = "h-4 w-auto" }: Props) {
  const each = payzyInstallmentEach(goods, freight);
  if (each == null) return null;

  return (
    <p className={`mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold leading-none text-gray-600 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/payzy.png" alt="Payzy" className={`${logoClassName} object-contain`} />
      <span>or 4 × {formatPayzyEach(each)}</span>
    </p>
  );
}
