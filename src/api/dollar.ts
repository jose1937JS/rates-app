import { API_BASE } from '@env'

export const fetchDollarPrice = async () => {
  try {
    const response = await fetch(`${API_BASE}/rates/today`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('DATA', data);
    return data;
  } catch (error) {
    console.error('Error fetching dollar price:', error);
    throw error;
  }
};