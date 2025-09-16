import { API_BASE } from '@env'
import Toast from 'react-native-simple-toast';

const onError = (error: any) => {
  // console.error(error);
  if(error.response.status == 429) {
    Toast.show(error.data.error, Toast.LONG, {
      backgroundColor: 'red'
    })
  }
  throw error;
}

export const fetchDollarPrice = async () => {
  try {
    const response = await fetch(`${API_BASE}/rates/today`);
    const data = await response.json();
    
    if (!response.ok) throw { response, data };
  
    return data;
  } catch (error) {
    onError(error)
  }
};

export const getActualRates = async () => {
  try {
    const response = await fetch(`${API_BASE}/get-actual-rates`, { method: 'POST' });
    const data = await response.json();
    
    if (!response.ok) throw { response, data };
    
    return data;
  } catch (error) {
    onError(error)
  }
};