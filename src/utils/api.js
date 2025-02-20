const BASE_URL = process.env.REACT_APP_API_URL || '';

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
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
  console.log('API URL:', `${BASE_URL}/orders`);  // Add debug logging
  const response = await fetch(`${BASE_URL}/orders`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};
