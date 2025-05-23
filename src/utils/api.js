const BASE_URL = import.meta.env.VITE_API_URL || '';

// Add environment logging
console.log('Current environment:', import.meta.env.MODE);
console.log('API Base URL:', BASE_URL);

console.log('Base URL:', BASE_URL); // Keep this debug log

// Export BASE_URL so other components can use it
export { BASE_URL };

export const createOrder = async (orderData) => {
  const url = `${BASE_URL}/api/orders`;
  console.log('Creating order at:', url); // Add request URL logging
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        remainingThalis: orderData.type === 'regular' ? orderData.thaliCount : orderData.guestCount
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);  // Add error logging
    throw new Error(error.message || 'Failed to create order');
  }
};

export const getOrders = async () => {
  const url = `${BASE_URL}/api/orders`;
  console.log('Fetching orders from:', url); // Add request URL logging
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};

// Add a new function for delivering orders
export const deliverOrder = async (orderId, deliveryData) => {
  const url = `${BASE_URL}/api/orders/${orderId}/deliver`;
  console.log('Delivering order at:', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deliveryData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to deliver order');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to deliver order');
  }
};
