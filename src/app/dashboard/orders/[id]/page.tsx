"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAuthData } from "@/lib/auth-api";
import { catalogImageSrc } from "@/lib/media-url";

const statusSteps = [
  { id: 'pending', label: 'Order Placed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'completed', label: 'Completed' }
];

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetchAuthData(`/api/dashboard/orders/${orderId}`);
        setOrder(res);
      } catch (e) {
        console.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-2xl w-full"></div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  const currentStepIdx = statusSteps.findIndex(s => s.id === order.status);

  // Determine WhatsApp Link
  const waMsg = encodeURIComponent(`Hello PrintWorksLK, I need help with order #${order.order_number}`);
  const whatsappUrl = `https://wa.me/94770000000?text=${waMsg}`; // Replace with actual number

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h2>
          <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          {order.invoices && order.invoices.length > 0 && (
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              <i className="bi bi-download" /> Invoice
            </button>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-bold text-white shadow-sm shadow-green-500/30 transition hover:bg-green-600"
          >
            <i className="bi bi-whatsapp" /> WhatsApp Help
          </a>
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
        
        {order.status === 'cancelled' ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
             <i className="bi bi-x-circle-fill text-xl"></i>
             <span className="font-semibold">This order has been cancelled.</span>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-5 left-6 w-[calc(100%-3rem)] h-1 bg-gray-100 -z-0"></div>
            <div 
              className="absolute top-5 left-6 h-1 bg-emerald-500 -z-0 transition-all duration-500" 
              style={{ width: `calc(${Math.max(0, currentStepIdx) / (statusSteps.length - 1) * 100}% - ${currentStepIdx === 0 ? '0px' : '3rem'})` }}
            ></div>
            
            <div className="relative z-10 flex justify-between">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-3 w-24">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {isCompleted ? <i className="bi bi-check" /> : <i className="bi bi-dash" />}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Items */}
        <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h3 className="font-bold text-gray-900">Items Ordered</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {order.items?.map((item: any) => (
              <li key={item.id} className="flex gap-4 p-6">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  {item.customization_fee > 0 && <p className="text-sm text-gray-500">+ Rs. {item.customization_fee} customization fee</p>}
                </div>
                <div className="font-bold text-gray-900 text-right">
                  <p>Rs. {Number(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>Rs. {Number(order.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Shipping</span>
              <span>Rs. {Number(order.shipping_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-brand-red mb-2">
                <span>Discount</span>
                <span>- Rs. {Number(order.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-lg mt-4 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Details sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Delivery Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
              <p>{order.shipping_address?.line1}</p>
              {order.shipping_address?.line2 && <p>{order.shipping_address?.line2}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
              <p>{order.shipping_address?.country}</p>
              <p className="mt-2 text-gray-500"><i className="bi bi-telephone me-2"></i> {order.shipping_address?.phone || '-'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Payment Info</h3>
            <p className="text-sm text-gray-600 mb-2">Status: <span className="font-semibold text-gray-900 capitalize">{order.payment_status}</span></p>
            {order.payments?.map((payment: any) => (
               <div key={payment.id} className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
                 <p className="font-semibold text-gray-700 capitalize mb-1">{payment.payment_method}</p>
                 <p className="text-gray-500">Amount: Rs. {payment.amount}</p>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
