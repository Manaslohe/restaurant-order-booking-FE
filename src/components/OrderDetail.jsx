import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function OrderDetail({ order, onClose, onDeliveryUpdate }) {
  const [deliveryQuantity, setDeliveryQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [deliveredBy, setDeliveredBy] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order?.remainingThalis > 0) {
      setDeliveryQuantity(1);
    }
  }, [order]);

  const handleDelivery = async () => {
    try {
      if (!deliveredBy.trim()) {
        toast.error('Please enter who is delivering');
        return;
      }

      const quantity = parseInt(deliveryQuantity);
      if (isNaN(quantity) || quantity < 1) {
        toast.error('Please enter a valid quantity');
        return;
      }

      if (quantity > order.remainingThalis) {
        toast.error(`Cannot deliver more than ${order.remainingThalis} thalis`);
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          quantity,
          note: note.trim(),
          deliveredBy: deliveredBy.trim()
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update delivery');
      }

      if (onDeliveryUpdate) {
        onDeliveryUpdate(data);
        toast.success(`Delivered ${quantity} thalis successfully!`);
        onClose();
      }
    } catch (error) {
      console.error('Delivery error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 z-50">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden transition-all duration-300 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-100 to-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-orange-500 p-2 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Order #{order._id.slice(-6)}</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 touch:p-4"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Section - Order History (Previously Order Info) */}
          <section className="space-y-4 sm:space-y-6">
            {/* Delivery History */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 shadow-sm h-full">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Delivery History</h3>
              <div className="space-y-3 text-sm">
                {order.deliveredThalis?.length > 0 ? (
                  order.deliveredThalis.slice(0, 3).map((delivery, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-orange-200">
                      <p className="font-medium text-gray-800">{delivery.quantity} thalis delivered</p>
                      <p className="text-gray-600 text-xs">By: {delivery.deliveredBy || 'Not specified'}</p>
                      <p className="text-gray-600 text-xs">At: {new Date(delivery.deliveredAt).toLocaleString()}</p>
                      {delivery.note && <p className="text-gray-600 text-xs mt-1 italic">Note: {delivery.note}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">No deliveries recorded</p>
                )}
              </div>
            </div>
          </section>

          {/* Middle Section - Order Details (Previously Delivery Status & History) */}
          <section className="bg-gray-50 rounded-xl p-4 sm:p-5 shadow-sm h-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              {order.type === 'regular' ? (
                <>
                  <p className="flex justify-between"><span className="text-gray-600">Customer:</span> <span className="font-medium">{order.name}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Phone:</span> <span className="font-medium">{order.phone}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Total Thalis:</span> <span className="font-medium">{order.thaliCount}</span></p>
                </>
              ) : (
                <>
                  <p className="flex justify-between"><span className="text-gray-600">Event:</span> <span className="font-medium">{order.eventName}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Booker:</span> <span className="font-medium">{order.bookerName}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Guests:</span> <span className="font-medium">{order.guestCount}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span></p>
                  <p className="flex justify-between"><span className="text-gray-600">Time:</span> <span className="font-medium">{order.time}</span></p>
                </>
              )}
            </div>

            {/* Delivery Status */}
            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.remainingThalis === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {order.remainingThalis}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {order.totalDelivered || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((order.type === 'regular' ? order.thaliCount : order.guestCount) - 
                              order.remainingThalis) / (order.type === 'regular' ? 
                              order.thaliCount : order.guestCount) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right Section - New Delivery Form */}
          <section className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            {order.remainingThalis > 0 ? (
              <div className="bg-orange-50 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Record New Delivery</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Max: {order.remainingThalis})</label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryQuantity(prev => Math.max(1, prev - 1))}
                        disabled={deliveryQuantity <= 1}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full text-xl font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
                      >-</button>
                      <input
                        type="number"
                        min="1"
                        max={order.remainingThalis}
                        value={deliveryQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= order.remainingThalis) {
                            setDeliveryQuantity(value);
                          }
                        }}
                        className="flex-1 p-2 sm:p-3 border border-gray-200 rounded-lg text-center text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => setDeliveryQuantity(prev => Math.min(order.remainingThalis, prev + 1))}
                        disabled={deliveryQuantity >= order.remainingThalis}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full text-xl font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivered By</label>
                    <input
                      type="text"
                      value={deliveredBy}
                      onChange={(e) => setDeliveredBy(e.target.value)}
                      placeholder="Enter delivery person"
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add delivery notes..."
                      className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>

                  <button
                    onClick={handleDelivery}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg text-base sm:text-lg font-medium
                             hover:bg-orange-600 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Record Delivery'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-4 sm:p-5 shadow-sm text-center">
                <div>
                  <p className="text-base sm:text-lg font-medium text-green-800">Delivery Complete!</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-1">All thalis have been delivered</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;