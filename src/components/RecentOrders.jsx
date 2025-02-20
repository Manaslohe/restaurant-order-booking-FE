import { useState } from 'react';
import OrderDetail from './OrderDetail';

function RecentOrders({ orders, searchTerm, onOrderUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const name = order.type === 'regular' ? order.name : order.eventName;
    return name?.toLowerCase().includes(searchLower) || 
           order.phone?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Orders List */}
      {filteredOrders.map(order => (
        <div 
          key={order._id}
          onClick={() => setSelectedOrder(order)}
          className="w-full bg-white rounded-xl shadow-md border-l-4 
                   border-l-orange-500 cursor-pointer
                   transition-all duration-300 hover:shadow-lg 
                   hover:-translate-y-1 transform touch-manipulation
                   outline-none focus:ring-2 focus:ring-orange-400"
          role="button"
          tabIndex={0}
        >
          <div className="p-2 sm:p-4 pt-[2px] sm:pt-2">
            {/* Header Row */}
            <div className="flex items-center justify-between sm:mb-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex-shrink-0 ${
                  order.status === 'completed' ? 'bg-green-500' :
                  order.status === 'partially_delivered' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />
                <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
                  {order.type === 'regular' ? 'Regular Order' : 'Event Booking'}
                </span>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium 
                              shadow-sm whitespace-nowrap ${
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'partially_delivered' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {order.status === 'pending' ? 'New Order' : 
                 order.status === 'partially_delivered' ? 'In Progress' : 'Completed'}
              </span>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                  {order.type === 'regular' ? order.name : order.eventName}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {order.phone}
                </div>
              </div>

              <div className="text-right min-w-[110px] sm:min-w-[130px] flex-shrink-0">
                <div className="text-sm sm:text-base text-gray-900 font-medium">
                  Total: {order.type === 'regular' ? order.thaliCount : order.guestCount}
                </div>
                <div className={`text-sm sm:text-base font-medium ${
                  order.remainingThalis === 0 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  Left: {order.remainingThalis}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    order.status === 'completed' ? 'bg-green-500' :
                    order.status === 'partially_delivered' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}
                  style={{
                    width: `${((order.type === 'regular' ? order.thaliCount : order.guestCount) - 
                            order.remainingThalis) / (order.type === 'regular' ? 
                            order.thaliCount : order.guestCount) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(updatedOrder) => {
            onOrderUpdate(updatedOrder);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* No Results Message */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-10 sm:py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-500 text-base sm:text-lg">
            {searchTerm ? 'No orders found matching your search' : 'No recent orders'}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;