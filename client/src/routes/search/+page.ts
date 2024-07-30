import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');
//   const maxPrice = url.searchParams.get('maxPrice');

  let query = 'http://localhost:3000/assets/browse?';
  if (category) query += `category=${category}&`;
  if (minPrice) query += `minPrice=${minPrice}&`;
//   if (maxPrice) query += `maxPrice=${maxPrice}&`;

  const response = await fetch(query);
  let data = { assets: [] };

  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }

  return {
    assets: data.assets || []
  };
};
