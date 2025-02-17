import axios from 'axios';
import { transformSet13Champions } from './utils/championTransforms'

// Log the API URL to verify it's being set correctly
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMetaCompositions = async () => {
  try {
    // Log the full URL being requested
    console.log('Requesting URL:', `${api.defaults.baseURL}/api/meta-comps`);
    const response = await api.get('/api/meta-comps');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAugments = async () => {
  const response = await api.get('/api/augments');
  return response.data;
};

export async function getChampions() {
  try {
    const response = await api.get('/api/champions');
    if (!response.data) {
      throw new Error('No data received from API');
    }
    const champions = transformSet13Champions(response.data);
    return { champions };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const getItems = async () => {
  try {
    const response = await api.get('/api/items');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api; 