// Import necessary types
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
  try {
    const response = await fetch('http://localhost:3000/assets/browse');
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const data = await response.json();
    return {
      props: {
        assets: data
      }
    };
  } catch (error) {
    console.error('Error loading assets:', error);
    return {
      props: {
        assets: []
      }
    };
  }
};
