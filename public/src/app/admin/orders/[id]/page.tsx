"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAuthData } from "@/lib/auth-api";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  const { showToast } = useToast();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Shipment State
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingNotes, setShippingNotes] = useState("");
  const [updatingShipment, setUpdatingShipment] = useState(false);

  // Status State
  const [status, setStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      const res = await fetchAuthData(`/api/v1/admin/orders/${orderId}`);
      setOrder(res.data || res);
      setStatus(res.data?.status || res.status);
    } catch (e) {
      console.error("Failed to load order details", e);
      showToast("Failed to load order.", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async () => {
    setUpdatingStatus(true);
    try {
      await fetchAuthData(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      showToast("Order status updated securely.", "success");
      loadOrder(); // Reload to get logs
    } catch (e) {
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingShipment(true);
    try {
      await fetchAuthData(`/api/v1/admin/orders/${orderId}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          shipping_method: shippingMethod,
          notes: shippingNotes
        })
      });
      showToast("Shipment details added successfully.", "success");
      setTrackingNumber("");
      setShippingMethod("");
      setShippingNotes("");
      loadOrder();
    } catch (e) {
      showToast("Failed to add shipment", "error");
    } finally {
      setUpdatingShipment(false);
    }
  };

  const handleResendNotification = async (type: 'email' | 'sms', logId: number) => {
    try {
      await fetchAuthData(`/api/v1/admin/notifications/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, log_id: logId })
      });
      showToast(`${type.toUpperCase()} resent successfully.`, "success");
    } catch (e) {
      showToast(`Failed to resend ${type}`, "error");
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl w-full"></div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
         <Link href="/admin/orders" className="hover:text-brand-red"><i className="bi bi-arrow-left me-1"></i>Back to Orders</Link>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-brand-red focus:ring-brand-red font-medium capitalize"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            onClick={handleUpdateStatus}
            disabled={updatingStatus || status === order.status}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {updatingStatus ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content: Items and Customer Info */}
        <div className="lg:col-span-2 space-y-6">
           <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Order Items</h2>
             </div>
             <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Item</th>
                    <th className="px-6 py-3 font-semibold text-center">Qty</th>
                    <th className="px-6 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.product_name}</div>
                        {item.customization_fee > 0 && <div className="text-xs text-brand-red mt-1">+ Customization: Rs. {item.customization_fee}</div>}
                      </td>
                      <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">Rs. {Number(item.total_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
               <div className="flex justify-between text-sm text-gray-600 mb-1">
                 <span>Subtotal</span>
                 <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm text-gray-600 mb-1">
                 <span>Shipping</span>
                 <span>Rs. {Number(order.shipping_cost).toLocaleString()}</span>
               </div>
               {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-brand-red mb-1">
                    <span>Discount</span>
                    <span>- Rs. {Number(order.discount_amount).toLocaleString()}</span>
                  </div>
               )}
               <div className="flex justify-between font-bold text-gray-900 text-base mt-3 pt-3 border-t border-gray-200">
                 <span>Total</span>
                 <span>Rs. {Number(order.total).toLocaleString()}</span>
               </div>
             </div>
           </div>

           {/* Customer & Shipping Addresses */}
           <div className="grid gap-6 sm:grid-cols-2">
             <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><i className="bi bi-person text-gray-400"></i> Customer</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="font-medium text-gray-900">{order.customer?.name}</p>
                  <p><a href={`mailto:${order.customer?.email}`} className="text-brand-red hover:underline">{order.customer?.email}</a></p>
                  <p>{order.customer?.phone || 'No phone provided'}</p>
                  <p className="mt-4 text-xs text-gray-400">Total Orders: {order.customer?.total_orders}</p>
                </div>
             </div>
             
             <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><i className="bi bi-geo-alt text-gray-400"></i> Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                  <p>{order.shipping_address?.line1}</p>
                  {order.shipping_address?.line2 && <p>{order.shipping_address?.line2}</p>}
                  <p>{order.shipping_address?.city}, {order.shipping_address?.district}</p>
                  <p>{order.shipping_address?.postal_code}</p>
                  <p>{order.shipping_address?.country}</p>
                  <p className="mt-2 text-gray-500"><i className="bi bi-telephone me-1"></i> {order.shipping_address?.phone || '-'}</p>
                </div>
             </div>
           </div>
           
           {/* Add Shipment Form */}
           {order.status !== 'cancelled' && (
             <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><i className="bi bi-truck text-gray-400"></i> Add Shipment Details</h3>
                <form onSubmit={handleAddShipment} className="grid gap-4 sm:grid-cols-2">
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Tracking Number</label>
                     <input type="text" required value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="w-full rounded-lg border-gray-300 text-sm focus:border-brand-red focus:ring-brand-red" placeholder="e.g. TRK12345678" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Shipping Method / Carrier</label>
                     <input type="text" required value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} className="w-full rounded-lg border-gray-300 text-sm focus:border-brand-red focus:ring-brand-red" placeholder="e.g. PromptX, Aramex" />
                   </div>
                   <div className="sm:col-span-2">
                     <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (Optional)</label>
                     <textarea value={shippingNotes} onChange={e => setShippingNotes(e.target.value)} rows={2} className="w-full rounded-lg border-gray-300 text-sm focus:border-brand-red focus:ring-brand-red" placeholder="Internal notes or customer visible tracking link" />
                   </div>
                   <div className="sm:col-span-2 flex justify-end">
                      <button type="submit" disabled={updatingShipment} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                        {updatingShipment ? "Saving..." : "Save Shipment"}
                      </button>
                   </div>
                </form>
             </div>
           )}
        </div>

        {/* Sidebar: Logs & History */}
        <div className="space-y-6">
           <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Status History</h3>
              <div className="space-y-4">
                {order.statusHistory?.map((history: any, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm">
                     <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5"></div>
                        {idx !== order.statusHistory.length - 1 && <div className="w-px h-full bg-gray-200 my-1"></div>}
                     </div>
                     <div className="pb-2">
                        <p className="font-semibold text-gray-900 capitalize">{history.status}</p>
                        <p className="text-xs text-gray-500">{new Date(history.created_at).toLocaleString()}</p>
                        {history.notes && <p className="text-gray-600 mt-1 text-xs bg-gray-50 p-2 rounded border border-gray-100">{history.notes}</p>}
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Notification Logs</h3>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Emails Sent</h4>
                {order.emailLogs?.length === 0 ? <p className="text-xs text-gray-400">No emails sent.</p> : (
                  <ul className="space-y-3">
                    {order.emailLogs?.map((log: any) => (
                      <li key={log.id} className="text-xs p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{log.email_type} <span className={`font-normal ${log.is_sent ? 'text-emerald-600' : 'text-red-500'}`}>({log.is_sent ? 'Sent' : 'Failed'})</span></p>
                          <p className="text-gray-500 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleResendNotification('email', log.id)} className="text-brand-red hover:underline font-semibold" title="Resend"><i className="bi bi-arrow-clockwise"></i></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">SMS Sent</h4>
                {order.smsLogs?.length === 0 ? <p className="text-xs text-gray-400">No SMS sent.</p> : (
                  <ul className="space-y-3">
                    {order.smsLogs?.map((log: any) => (
                      <li key={log.id} className="text-xs p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-start">
                         <div>
                          <p className="font-semibold text-gray-800 capitalize">{log.event_type} <span className={`font-normal ${log.is_sent ? 'text-emerald-600' : 'text-red-500'}`}>({log.is_sent ? 'Sent' : 'Failed'})</span></p>
                          <p className="text-gray-500 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleResendNotification('sms', log.id)} className="text-brand-red hover:underline font-semibold" title="Resend"><i className="bi bi-arrow-clockwise"></i></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
