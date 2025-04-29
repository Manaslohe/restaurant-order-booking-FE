import { useState, useEffect } from 'react';
import OrderDetail from './OrderDetail';

function RecentOrders({ orders, searchTerm, onOrderUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    // Apply highlight animation for new or updated orders and sort by date (newest first)
    const processedOrders = orders.map(order => ({
      ...order,
      className: order.isNew ? 'order-item-new' : (order.isUpdated ? 'order-item-updated' : '')
    }));
    
    // Sort orders by creation date (newest first)
    // If creationDate is same, sort by status priority
    const sorted = [...processedOrders].sort((a, b) => {
      // First sort by date (most recent first)
      const dateComparison = new Date(b.createdAt) - new Date(a.createdAt);
      
      if (dateComparison !== 0) {
        return dateComparison;
      }
      
      // If dates are same, then sort by status
      const statusPriority = { 'pending': 0, 'partially_delivered': 1, 'completed': 2 };
      return statusPriority[a.status] - statusPriority[b.status];
    });
    
    setSortedOrders(sorted);
    
    // Trigger animation when orders change
    setAnimation(true);
    const timer = setTimeout(() => setAnimation(false), 300);
    
    return () => clearTimeout(timer);
  }, [orders]);

  const filteredOrders = sortedOrders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const name = order.type === 'regular' ? order.name : order.eventName;
    const orderId = order._id.slice(-6).toLowerCase();
    const phoneNumber = order.type === 'regular' ? order.phone : order.mobileNumber;
    
    return name?.toLowerCase().includes(searchLower) || 
           phoneNumber?.toLowerCase().includes(searchLower) ||
           orderId.includes(searchLower);
  });

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 
                          bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            Completed
          </span>
        );
      case 'partially_delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 
                          bg-orange-100 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 
                          bg-blue-100 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            New Order
          </span>
        );
    }
  };

  return (
    <div className={`space-y-3 sm:space-y-4 transition-all ${animation ? 'opacity-80' : 'opacity-100'}`}>
      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => (
          <div 
            key={order._id}
            onClick={() => handleOrderClick(order)}
            className={`group w-full bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100
                     cursor-pointer transition-all duration-200 hover:-translate-y-0.5 relative
                     transform touch-manipulation outline-none focus:ring-2 focus:ring-orange-400
                     ${order.className || ''}`}
            role="button"
            tabIndex={0}
          >
            <div className="p-3 sm:p-4">
              {/* Two-column layout for better space utilization */}
              <div className="flex justify-between items-start">
                {/* Left column - Order info */}
                <div className="flex gap-2.5 sm:gap-3 flex-1 min-w-0">
                  {/* Order type icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                ${order.type === 'regular' 
                                 ? 'bg-orange-100 text-orange-600' 
                                 : 'bg-blue-100 text-blue-600'}`}>
                    {order.type === 'regular' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 9h8a7 7 0 00-8 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Order details - stacked vertically */}
                  <div className="flex-1 min-w-0">
                    {/* Order name and badge */}
                    <div className="flex items-start justify-between mb-0.5">
                      <div className="pr-2">
                        <div className="font-medium text-gray-900 text-base sm:text-lg truncate max-w-[210px] sm:max-w-none">
                          {order.type === 'regular' ? order.name : order.eventName}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order details in compact format */}
                    <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">#</span>{order._id.slice(-6)}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {console.log('Order data:', order)}
                        <span>
                          {order.phone || order.mobileNumber || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Status and progress */}
                <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                  {/* Status badge */}
                  {getStatusBadge(order.status)}
                  
                  {/* Thali count info */}
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium text-gray-700">
                        {order.type === 'regular' ? order.thaliCount : order.guestCount}
                      </span>
                    </div>
                    <div className={`flex gap-1.5 items-center ${
                      order.remainingThalis === 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {order.remainingThalis === 0 ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Done</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{order.remainingThalis}</span>
                          <span>left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 mb-0.5">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      order.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      order.status === 'partially_delivered' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}
                    style={{
                      width: `${((order.type === 'regular' ? order.thaliCount : order.guestCount) - 
                              order.remainingThalis) / (order.type === 'regular' ? 
                              order.thaliCount : order.guestCount) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              {/* View Details hint - appears on hover */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 bg-white/90 rounded-md text-xs font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        // No Results Message
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-50 rounded-full p-4 w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">No orders found</p>
              <p className="mt-1 text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'Create a new order to get started'}
              </p>
            </div>
            {searchTerm && (
              <button
                className="mt-2 px-4 py-2 text-orange-600 text-sm font-medium border border-orange-200 
                         rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                onClick={() => document.querySelector('input[placeholder="Search orders..."]').focus()}
              >
                Clear search and show all orders
              </button>
            )}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDeliveryUpdate={onOrderUpdate}
        />
      )}
    </div>
  );
}

export default RecentOrders;