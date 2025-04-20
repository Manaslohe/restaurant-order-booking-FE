import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function OrderDetail({ order, onClose, onDeliveryUpdate }) {
  const [deliveryQuantity, setDeliveryQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [deliveredBy, setDeliveredBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setUpdatedOrder(order);
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

      if (quantity > updatedOrder.remainingThalis) {
        toast.error(`Cannot deliver more than ${updatedOrder.remainingThalis} thalis`);
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/${updatedOrder._id}/deliver`, {
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

      // Update local state immediately
      setUpdatedOrder(data);
      
      // Show confirmation message
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      
      // Reset form fields
      setNote('');
      setDeliveryQuantity(1);
      
      // Notify parent component
      if (onDeliveryUpdate) {
        onDeliveryUpdate(data);
      }
      
      toast.success(`Delivered ${quantity} thalis successfully!`);
    } catch (error) {
      console.error('Delivery error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-0 sm:p-2 md:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-2xl shadow-2xl 
                    overflow-hidden transition-all duration-300 sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[1200px]
                    flex flex-col">
        {/* Confirmation overlay */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 max-w-md shadow-2xl transform animate-scaleIn">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Delivery Recorded!</h3>
                <p className="text-gray-600">
                  {deliveryQuantity} thali{deliveryQuantity > 1 ? 's' : ''} delivered by {deliveredBy}
                </p>
                <p className="text-sm text-gray-500">Updated automatically</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-orange-100 to-white border-b border-gray-200 
                      flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-full shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order #{updatedOrder._id.slice(-6)}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  updatedOrder.remainingThalis === 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {updatedOrder.remainingThalis === 0 ? 'Completed' : 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                <p>Created: {new Date(updatedOrder.createdAt).toLocaleString()}</p>
                <p>Type: {updatedOrder.type === 'regular' ? 'Regular Order' : 'Event Order'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 
                     active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto styled-scrollbar">
          <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Order Details & History Column - Takes 2/3 width on large screens */}
            <div className="lg:w-2/3 space-y-4 md:space-y-6">
              {/* Customer/Event Info Card */}
              <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {updatedOrder.type === 'regular' ? 'Customer Information' : 'Event Information'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  {updatedOrder.type === 'regular' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Customer:</span> <span className="font-medium">{updatedOrder.name}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Phone:</span> <span className="font-medium">{updatedOrder.phone}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Total Thalis:</span> <span className="font-medium">{updatedOrder.thaliCount}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Order Date:</span> <span className="font-medium">{new Date(updatedOrder.createdAt).toLocaleDateString()}</span></p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Event:</span> <span className="font-medium">{updatedOrder.eventName}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Booker:</span> <span className="font-medium">{updatedOrder.bookerName}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Guests:</span> <span className="font-medium">{updatedOrder.guestCount}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Event Date:</span> <span className="font-medium">{new Date(updatedOrder.date).toLocaleDateString()}</span></p>
                      <p className="flex justify-between sm:block"><span className="text-gray-600 mr-2">Event Time:</span> <span className="font-medium">{updatedOrder.time}</span></p>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Delivery Status Card */}
              <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delivery Status
                </h3>
                <div className="space-y-5">
                  {/* Status cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Total Card */}
                    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-lg font-bold text-gray-800">
                        {updatedOrder.type === 'regular' ? updatedOrder.thaliCount : updatedOrder.guestCount}
                      </p>
                    </div>
                    
                    {/* Remaining Card */}
                    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Remaining</p>
                      <p className={`text-lg font-bold ${updatedOrder.remainingThalis === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {updatedOrder.remainingThalis}
                      </p>
                    </div>
                    
                    {/* Delivered Card */}
                    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Delivered</p>
                      <p className="text-lg font-bold text-blue-600">
                        {updatedOrder.totalDelivered || 0}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Delivery Progress</span>
                      <span className="text-gray-800 font-bold">
                        {Math.round(((updatedOrder.type === 'regular' ? updatedOrder.thaliCount : updatedOrder.guestCount) - 
                        updatedOrder.remainingThalis) / (updatedOrder.type === 'regular' ? 
                        updatedOrder.thaliCount : updatedOrder.guestCount) * 100)}%
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${((updatedOrder.type === 'regular' ? updatedOrder.thaliCount : updatedOrder.guestCount) - 
                                  updatedOrder.remainingThalis) / (updatedOrder.type === 'regular' ? 
                                  updatedOrder.thaliCount : updatedOrder.guestCount) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Delivery History Card */}
              <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delivery History
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 styled-scrollbar">
                  {updatedOrder.deliveredThalis?.length > 0 ? (
                    updatedOrder.deliveredThalis.map((delivery, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 border-orange-200 transform transition-transform hover:translate-x-1">
                        <div className="flex justify-between mb-1">
                          <p className="font-bold text-gray-800">{delivery.quantity} thalis</p>
                          <p className="text-xs text-gray-500">{new Date(delivery.deliveredAt).toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-700">By: {delivery.deliveredBy || 'Not specified'}</p>
                        {delivery.note && <p className="text-sm text-gray-600 mt-1 italic bg-white px-2 py-1 rounded">{delivery.note}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 20V4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No deliveries recorded yet</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            {/* Delivery Form Column - Takes 1/3 width on large screens */}
            <div className="lg:w-1/3 sticky top-0 self-start">
              {updatedOrder.remainingThalis > 0 ? (
                <section className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-sm border border-orange-100">
                  <div className="p-4 md:p-5 border-b border-orange-100">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Record New Delivery
                    </h3>
                  </div>
                  <div className="p-4 md:p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-xs text-gray-500">(Max: {updatedOrder.remainingThalis})</span>
                      </label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setDeliveryQuantity(prev => Math.max(1, prev - 1))}
                          disabled={deliveryQuantity <= 1}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full text-xl font-medium hover:bg-gray-100 
                                    active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                    shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          max={updatedOrder.remainingThalis}
                          value={deliveryQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= updatedOrder.remainingThalis) {
                              setDeliveryQuantity(value);
                            }
                          }}
                          className="flex-1 p-2 sm:p-3 border border-gray-200 rounded-lg text-center text-base sm:text-lg font-medium
                                  focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setDeliveryQuantity(prev => Math.min(updatedOrder.remainingThalis, prev + 1))}
                          disabled={deliveryQuantity >= updatedOrder.remainingThalis}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full text-xl font-medium hover:bg-gray-100 
                                    active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                    shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >+</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivered By</label>
                      <input
                        type="text"
                        value={deliveredBy}
                        onChange={(e) => setDeliveredBy(e.target.value)}
                        placeholder="Enter delivery person's name"
                        className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm 
                                 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all
                                 placeholder-gray-400 bg-white hover:border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note <span className="text-xs text-gray-500">(Optional)</span>
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add delivery notes..."
                        className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm resize-none h-20 
                                 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all
                                 placeholder-gray-400 bg-white hover:border-gray-300"
                      />
                    </div>

                    <button
                      onClick={handleDelivery}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg 
                               text-base font-medium hover:from-orange-600 hover:to-orange-700
                               transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]
                               disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow
                               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : 'Record Delivery'}
                    </button>
                  </div>
                </section>
              ) : (
                <section className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-sm border border-green-100 text-center flex flex-col items-center justify-center h-full min-h-[320px]">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Delivery Complete!</h3>
                  <p className="text-green-600 mb-4">All {updatedOrder.type === 'regular' ? updatedOrder.thaliCount : updatedOrder.guestCount} thalis have been delivered</p>
                  <div className="text-sm text-gray-500 bg-white p-3 rounded-lg shadow-sm max-w-xs mb-6">
                    <p>Last delivered: {updatedOrder.deliveredThalis?.length > 0 ? 
                      new Date(updatedOrder.deliveredThalis[0].deliveredAt).toLocaleString() : 'N/A'}</p>
                    <p>By: {updatedOrder.deliveredThalis?.length > 0 ? 
                      updatedOrder.deliveredThalis[0].deliveredBy : 'N/A'}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg 
                            hover:from-green-600 hover:to-green-700 transition-all duration-200 
                            text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500
                            shadow-sm hover:shadow transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Close
                  </button>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;