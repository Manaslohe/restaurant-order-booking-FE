import { useState, useMemo, useEffect } from 'react';
import OrderDetail from './OrderDetail';
import { 
  ArrowLeft,
  Download, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Package, 
  Users, 
  CheckCircle, 
  Truck,
  Calendar,
  Clock,
  Trash2
} from 'lucide-react';

function OrderHistory({ orders, onOrderUpdate, onClose }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Entrance animation
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const partial = orders.filter(o => o.status === 'partially_delivered').length;
    const totalThalis = orders.reduce((acc, order) => 
      acc + (order.type === 'regular' ? order.thaliCount : order.guestCount), 0);
    const deliveredThalis = orders.reduce((acc, order) => 
      acc + (order.totalDelivered || 0), 0);
    const avgThalisPerOrder = total ? (totalThalis / total).toFixed(1) : 0;
    const avgDeliveryTime = total ? (
      orders.reduce((acc, order) => {
        if (order.deliveryDate && order.createdAt) {
          return acc + (new Date(order.deliveryDate) - new Date(order.createdAt)) / (1000 * 60 * 60);
        }
        return acc;
      }, 0) / completed
    ).toFixed(1) : 0;
    
    return {
      total,
      completed,
      pending,
      partial,
      totalThalis,
      deliveredThalis,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0,
      avgThalisPerOrder,
      avgDeliveryTime
    };
  }, [orders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesType = filterType === 'all' || order.type === filterType;
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
          (order.type === 'regular' ? order.name : order.eventName)?.toLowerCase().includes(searchLower) ||
          order.phone?.includes(searchTerm);
        
        return matchesType && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const sortMultiplier = sortOrder === 'desc' ? -1 : 1;
        switch (sortBy) {
          case 'date':
            return (new Date(b.createdAt) - new Date(a.createdAt)) * sortMultiplier;
          case 'quantity':
            return (b.thaliCount - a.thaliCount) * sortMultiplier;
          case 'name':
            return ((a.type === 'regular' ? a.name : a.eventName)
              ?.localeCompare(b.type === 'regular' ? b.name : b.eventName)) * sortMultiplier;
          default:
            return 0;
        }
      });
  }, [orders, filterType, filterStatus, searchTerm, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Type',
      'Name',
      'Phone',
      'Total Thalis/Guests',
      'Delivered',
      'Remaining',
      'Status',
      'Created At',
      'Delivery Date',
      'Address',
      'Payment Status',
      'Total Amount',
      'Delivery Notes'
    ];

    const csvData = filteredOrders.map(order => [
      order._id,
      order.type,
      order.type === 'regular' ? order.name : order.eventName,
      order.phone || '',
      order.type === 'regular' ? order.thaliCount : order.guestCount,
      order.totalDelivered || 0,
      order.remainingThalis,
      order.status,
      new Date(order.createdAt).toLocaleString(),
      order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : '',
      order.address || '',
      order.paymentStatus || 'N/A',
      order.totalAmount || '',
      order.deliveryNotes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSortBy('date');
    setSortOrder('desc');
    setSearchTerm('');
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-gray-50 to-white z-50 overflow-auto transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors duration-200 flex-shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-6 h-6 text-orange-600" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-7 h-7 text-orange-500" />
                Order History
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Viewing {filteredOrders?.length || 0} of {orders.length} orders
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative group">
              <button
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {(filterType !== 'all' || filterStatus !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 -right-0.5"></span>
                )}
              </button>
              
              {isFiltersVisible && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-10 p-4 animate-fadeIn">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Filters</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear all
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Order Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="all">All Types</option>
                        <option value="regular">Regular Orders</option>
                        <option value="event">Event Bookings</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="partially_delivered">Partial</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                      <div className="flex gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg 
                                  focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          <option value="date">Date</option>
                          <option value="quantity">Quantity</option>
                          <option value="name">Name</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-orange-50 
                                  transition-colors duration-200"
                          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        >
                          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                          bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg 
                        hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow
                        flex items-center gap-2 transition-all duration-200 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg text-orange-600">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{analytics.completionRate}% complete</p>
                <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                  {analytics.pending} pending
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Thalis</p>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-gray-900">{analytics.totalThalis}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{analytics.deliveredThalis} delivered</p>
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {analytics.avgThalisPerOrder} avg/order
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-gray-900">{analytics.completed}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">{analytics.partial} partial</p>
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                  {(analytics.completed / (analytics.total || 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg text-amber-600">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-gray-900">
                {((analytics.deliveredThalis / analytics.totalThalis) * 100).toFixed(1)}%
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">of total thalis</p>
                <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  {analytics.totalThalis - analytics.deliveredThalis} remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              Order Details
              <span className="text-sm font-normal text-gray-500">
                ({filteredOrders.length} orders)
              </span>
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="overflow-auto max-h-[60vh] styled-scrollbar">
            {filteredOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order, index) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`group cursor-pointer hover:bg-orange-50 transition-colors duration-200 px-6 py-4
                              ${order.isNew ? 'animate-highlight' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 items-start min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-1
                                      ${order.type === 'regular' 
                                        ? 'bg-orange-100 text-orange-600' 
                                        : 'bg-blue-100 text-blue-600'}`}>
                          {order.type === 'regular' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-8 9h8a7 7 0 00-8 0z" />
                            </svg>
                          ) : (
                            <Calendar className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-medium text-gray-800 text-base truncate">
                              {order.type === 'regular' ? order.name : order.eventName}
                            </h3>
                            {new Date(order.createdAt) > new Date(Date.now() - 86400000) && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full inline-block bg-gray-400"></span>
                              Order #{order._id.slice(-6)}
                            </span>
                            
                            {order.phone && (
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {order.phone}
                              </span>
                            )}
                            
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-5">
                        {/* Order Status */}
                        <div className="hidden sm:block">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1
                                         ${order.status === 'completed' 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : order.status === 'partially_delivered'
                                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                            : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full
                                           ${order.status === 'completed'
                                             ? 'bg-green-600'
                                             : order.status === 'partially_delivered'
                                             ? 'bg-orange-600'
                                             : 'bg-blue-600'}`}>
                            </span>
                            {order.status === 'completed' 
                              ? 'Completed' 
                              : order.status === 'partially_delivered'
                              ? 'In Progress'
                              : 'New Order'}
                          </span>
                        </div>
                        
                        {/* Thali Count */}
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded
                                           ${order.remainingThalis === 0 
                                             ? 'bg-green-50 text-green-700' 
                                             : 'bg-orange-50 text-orange-700'}`}>
                              {order.type === 'regular' ? 'Thalis' : 'Guests'}
                            </span>
                            <div>
                              <p className="text-sm sm:text-base font-medium text-gray-800">
                                <span className="text-gray-500 sm:hidden">Total: </span>
                                {order.type === 'regular' ? order.thaliCount : order.guestCount}
                              </p>
                              <p className={`text-xs sm:text-sm
                                           ${order.remainingThalis === 0
                                             ? 'text-green-600'
                                             : 'text-orange-600'}`}>
                                {order.remainingThalis === 0 
                                  ? '✓ All Delivered' 
                                  : `${order.remainingThalis} remaining`}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* View Details Button - Only visible on hover */}
                        <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm
                                          hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2.5 sm:mt-3.5 sm:px-12">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500
                                   ${order.status === 'completed'
                                     ? 'bg-gradient-to-r from-green-400 to-green-500'
                                     : order.status === 'partially_delivered'
                                     ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                                     : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                          style={{
                            width: `${((order.type === 'regular' ? order.thaliCount : order.guestCount) - 
                                    order.remainingThalis) / (order.type === 'regular' ? 
                                    order.thaliCount : order.guestCount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                    ? "Try adjusting your filters or search term to find what you're looking for."
                    : 'There are no orders in the system yet. Orders will appear here once created.'}
                </p>
                {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 
                            transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <Filter className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default OrderHistory;