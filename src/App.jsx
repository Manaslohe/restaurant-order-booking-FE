import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import RegularBooking from './components/RegularBooking'
import EventBooking from './components/EventBooking'
import RecentOrders from './components/RecentOrders'
import Header from './components/Header'
import { getOrders } from './utils/api'
import OrderHistory from './components/OrderHistory'

function App() {
  const [bookingType, setBookingType] = useState('regular')
  const [showHistory, setShowHistory] = useState(false)
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    toast.success(`Selected ${bookingType} booking type`)
  }, [bookingType])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  const handleCreateOrder = async (orderData) => {
    try {
      const { createOrder } = await import('./utils/api');
      const newOrder = await createOrder({
        type: bookingType,
        timestamp: new Date().toISOString(),
        ...orderData,
        remainingThalis: bookingType === 'regular' ? orderData.thaliCount : orderData.guestCount
      });
      setOrders([newOrder, ...orders]);
      toast.success('Order created successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  }

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    toast.success('Order updated successfully');
  };

  return (
    <>
      {showHistory ? (
        <OrderHistory
          orders={orders}
          onClose={() => setShowHistory(false)}
          onOrderUpdate={handleOrderUpdate}
        />
      ) : (
        <div className="min-h-screen bg-gray-100 antialiased touch-manipulation">
          <Toaster position="top-right" toastOptions={{
            style: {
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
            }
          }} />
          <Header />
          
          <main className="w-full h-[calc(100vh-96px)] px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6 h-full max-w-screen-2xl mx-auto">
              {/* Left side - Recent Orders */}
              <section className="lg:w-2/3 w-full bg-white rounded-2xl shadow-lg 
                               transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 
                                 tracking-tight whitespace-nowrap">
                      Recent Orders
                    </h2>
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <div className="relative w-full sm:w-130">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search orders..."
                          className="w-full px-5 py-3 bg-gray-50 rounded-xl
                                   border border-gray-200 focus:outline-none focus:ring-2 
                                   focus:ring-orange-400 focus:bg-white transition-all duration-300
                                   text-gray-700 placeholder-gray-400 text-base sm:text-lg shadow-sm
                                   hover:shadow-md"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                          <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                      </div>
                      <button
                        onClick={() => setShowHistory(true)}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-orange-500 text-white rounded-xl 
                                 hover:bg-orange-600 transform transition-all duration-300 
                                 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                                 text-base sm:text-lg font-medium"
                      >
                        Order History
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-grow custom-scrollbar">
                  <RecentOrders 
                    orders={orders}
                    searchTerm={searchTerm}
                    onOrderUpdate={handleOrderUpdate}
                  />
                </div>
              </section>

              {/* Right side - Booking Form */}
              <section className="lg:w-1/3 w-full bg-white rounded-2xl shadow-lg 
                               transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight whitespace-nowrap">
                      New Order
                    </h2>
                    
                    {/* Enhanced Beautiful Select */}
                    <div className="relative flex-1 max-w-[220px]">
                      <div className="relative">
                        <select
                          value={bookingType}
                          onChange={(e) => setBookingType(e.target.value)}
                          className="w-full appearance-none pl-10 pr-10 py-2.5 text-base font-medium
                                  border border-gray-200 rounded-xl bg-white
                                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                                  cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <option value="regular" className="py-2">Regular Booking</option>
                          <option value="event" className="py-2">Event Booking</option>
                        </select>
                        
                        {/* Left Icon */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          {bookingType === 'regular' ? (
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 9h8a7 7 0 00-8 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        
                        {/* Right Icon (Dropdown Arrow) */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Type Indicator */}
                      <div className="absolute -bottom-2.5 left-3 right-3 h-1 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-orange-400 to-orange-500 animate-pulse-subtle"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 sm:p-2 overflow-y-auto custom-scrollbar">
                  {bookingType === 'regular' ? (
                    <RegularBooking onCreateOrder={handleCreateOrder} />
                  ) : (
                    <EventBooking onCreateOrder={handleCreateOrder} />
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      )}
    </>
  )
}

export default App