import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const category = url.searchParams.get('category');
  const price = url.searchParams.get('price');

  // Construct the API URL with query parameters
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (price) params.append('price', price);
  
  const query = `http://localhost:3000/assets/browse?${params.toString()}`;

  // Log the URL for debugging purposes
  console.log('Fetching URL:', query);

  try {
    const response = await fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` // Retrieve JWT token from local storage
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status} ${response.statusText}`);
    }

    let data = { assets: [] };

    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }

    return {
      assets: data.assets || []
    };
  } catch (error) {
    console.error('Error loading assets:', error);
    return {
      assets: [] // Return an empty array or handle the error appropriately
    };
  }
};
