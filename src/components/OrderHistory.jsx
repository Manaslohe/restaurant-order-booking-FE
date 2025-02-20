import { useState, useMemo } from 'react';
import OrderDetail from './OrderDetail';
import { 
  X, 
  Download, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Package, 
  Users, 
  CheckCircle, 
  Truck,
  ArrowLeft 
} from 'lucide-react';

function OrderHistory({ orders, onOrderUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/'} // Adjust this based on your routing setup
              className="p-2 hover:bg-orange-100 rounded-full transition-colors duration-200"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-orange-500" />
            </button>
            <Package className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                       flex items-center gap-2 transition-colors duration-200 touch:p-3"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <Package className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
              <p className="text-xs text-gray-500">{analytics.completionRate}% complete</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <Users className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Total Thalis/Guests</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalThalis}</p>
              <p className="text-xs text-gray-500">{analytics.deliveredThalis} delivered</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completed}</p>
              <p className="text-xs text-gray-500">{analytics.partial} partial</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
            <Truck className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {((analytics.deliveredThalis / analytics.totalThalis) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">of total delivered</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-orange-300 touch:py-3"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none touch:py-3"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none touch:py-3"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="partially_delivered">Partial</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-orange-300 touch:py-3"
            >
              <option value="date">Date</option>
              <option value="quantity">Quantity</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-orange-50 
                         transition-colors duration-200 touch:p-3"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-orange-50 
                           hover:shadow-lg transition-all duration-200 cursor-pointer touch:p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`w-3 h-3 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500' :
                      order.status === 'partially_delivered' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base truncate">
                        {order.type === 'regular' ? order.name : order.eventName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {order.phone || 'No phone'} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {order.type === 'regular' ? order.thaliCount : order.guestCount}
                      </p>
                      <p className="text-sm text-orange-600">{order.remainingThalis} left</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'partially_delivered' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500 flex items-center justify-center gap-2">
                <Package className="w-6 h-6" />
                <span>No orders match your filters</span>
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