const API_URL = 'http://localhost:5000/api';

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
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
    throw new Error(error.message || 'Failed to create order');
  }
};

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/orders`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};
