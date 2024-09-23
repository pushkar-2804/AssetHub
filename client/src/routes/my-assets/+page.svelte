<script lang="ts">
    import { onMount } from 'svelte';
    import Modal from "../../lib/Modal.svelte";
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
  
    const isAuthenticated = writable(false);
    const userMail = writable('');
    const errorMessage = writable('');

    function handleLogout() {
      localStorage.removeItem('token');
  
      // Redirect to the home page
      window.location.href = '/';
    }
  
    let options = [
        { text: 'GADGET' },
        { text: 'DEAL' },
        { text: 'SOFTWARE' },
    ];  
  
    const category = writable('GADGET');
  
    const assets = writable<Array<{
      assetId: number;
      assetName: string;
      description: string;
      price: number;
      category: string;
      image: string;
      images: string[];
    }>>([]);
  
    const showModal = writable(false);
    const selectedAsset = writable<any>(null);
  
    async function fetchMyAssets() {
      const userId = 1; // Replace with actual userId retrieval logic
      const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
  
      if (!token) {
        isAuthenticated.set(false);
        window.location.href = '/login';
      } else {
        isAuthenticated.set(true);
      }
  
      try {
        const response = await fetch('http://localhost:3000/assets/my-assets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include JWT token if required
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch assets: ${response.statusText}`);
        }
        const data = await response.json();
  
        // Directly set the fetched array to assets
        if (Array.isArray(data)) {
          assets.set(data);
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    }

  async function auth(){
    const token = localStorage.getItem('token');
      if (!token) {
        isAuthenticated.set(false);
        window.location.href = '/login';
      } else {
        isAuthenticated.set(true);
      }

      try {
    const response = await fetch('http://localhost:3000/users/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const userMailData = await response.json();
      userMail.set(userMailData.email);
    } else {
      errorMessage.set('Failed to fetch user details. Please log in again.');
    }
  } catch (error) {
    errorMessage.set('An error occurred. Please try again.');
  }
  }
  
    onMount(() => {
      fetchMyAssets();
      auth();
    });
  
    const handleViewAsset = (asset) => {
      selectedAsset.set(asset);
      showModal.set(true);
    };
  
    const handleAddToCart = async (assetId: number) => {
      const userId = 1; // Replace with actual userId retrieval logic
      const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
  
      if (!token) {
        console.error('No JWT token found');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include JWT token if required
          },
          body: JSON.stringify({ userId, assetId, quantity: 1 }), // Include userId in the body
        });
  
        if (!response.ok) {
          throw new Error(`Failed to add item to cart: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log('Item added to cart:', result);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };
  
    const closeModal = () => {
      showModal.set(false);
      selectedAsset.set(null);
    };
  
    const handleFilter = (event) => {
      const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
  
      if (!token) {
        console.error('No JWT token found');
        return;
      }
  
      event.preventDefault();
      const formData = new FormData(event.target);
      const category = formData.get('category')?.toString() || '';
      const price = formData.get('price')?.toString() || '';
  
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (price) params.append('price', price);
  
      goto(`/search?${params.toString()}`);
    };
</script>
  
  
  
  <div class="grow bg-indigo-900 pb-4">
    <nav class="bg-[#180161] border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="./AssetHub.svg" class="h-8" alt="AssetHub Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-[#EB3678] dark:text-white">AssetHub</span>
      </a>
      {#if !$isAuthenticated}
      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <form action="/login">
              <button type="submit" class="submit-button text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started for free</button>
          </form>
      </div>
      {:else}
      <!-- component -->
      <div class=" relative inline-block dropdown md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <span class="rounded-md shadow-sm">
          <button class="inline-flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
           type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
            <span>Options</span>
            <svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          </span>
        <div class="hidden dropdown-menu">
          <div class="absolute right-0 w-56 mt-2 origin-top-right bg-[#4F1787] border border-[#6c44ee] divide-y divide-[#6c44ee] rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
            {#if $isAuthenticated}
            <div class="px-4 py-3">
              <p class="text-sm leading-5 text-[#EB3678]">Signed in as</p>
              <p class="text-sm font-medium leading-5 text-[#FB773C] truncate">{$userMail}</p>
            </div>
            {/if}
            <div class="py-1">
              <a href="/dashboard" class="text-[#EB3678] flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Dashboard</a>
              <a href="/wallet-connection" class="text-[#EB3678] flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Wallet connection</a>
              <!-- <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span> -->
              <a href="/profile-settings" class="text-[#EB3678] flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Account settings</a></div>
            <div class="py-1">
              <form on:submit={handleLogout}>
                <button type="submit" class="text-[#EB3678] flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> 
      {/if}
      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#180161] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#180161] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a href="/" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-[#FB773C] md:dark:text-blue-500" aria-current="page">Home</a>
          </li>
          <li>
            <a href="/asset-listing" class="block py-2 px-3 md:p-0 text-[#EB3678] rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Asset Listing</a>
          </li>
          <li>
            <a href="/asset-browsing" class="block py-2 px-3 md:p-0 text-[#EB3678] rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Browse Assets</a>
          </li>
          <li>
            <a href="/my-assets" class="block py-2 px-3 md:p-0 text-[#EB3678] rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">My Assets</a>
          </li>
          <li>
            <a href="/cart" class="block py-2 px-3 md:p-0 text-[#EB3678] rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Cart</a>
          </li>
          <li>
                <a href="/orders" class="block py-2 px-3 md:p-0 text-[#EB3678] rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">My Orders</a>
            </li>
        </ul>
      </div>
      </div>
    </nav>
  
    <div class="mt-10 grow pt-10 w-4/5 p-5 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-[#180161] ring-1 ring-gray-900/5 ">
    <form on:submit={handleFilter} class="mb-6">
      <div class="mb-4 text-[#EB3678]">
        <label for="category" class="block text-sm font-xl text-[#FB773C] pb-2">Category</label>
        <!-- <input type="text" name="category" id="category" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" /> -->
        <select class="bg-[#4F1787]" id="category" bind:value={$category} name="category">
          {#each options as option}
            <option value={option.text}>
              {option.text}
            </option>
          {/each}
        </select>
      </div>
      <div class="mb-4">
        <label for="price" class="block text-sm font-xl text-[#FB773C] pb-2">Price</label>
        <input type="number" name="price" id="price" class="mt-1 p-2 block w-full text-[#FB773C] bg-[#4F1787] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <!-- <div class="mb-4">
        <label for="maxPrice" class="block text-sm font-medium text-gray-700">Max Price</label>
        <input type="number" name="maxPrice" id="maxPrice" class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div> -->
      <div class="flex justify-center">
        <div class="">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">Filter</button>
        </div>
      </div>
    </form>
    </div>
  
  
    <div class="mt-10 pt-10 w-4/5 p-5 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-[#180161] ring-1 ring-gray-900/5 backdrop-blur-lg">
      <div class="flex flex-col items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-4xl font-bold mb-5 text-[#FB773C] dark:text-white">My Assets</h1>
        </div>
        <div class="w-full">
          <table class="min-w-full divide-y">
            <thead >
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Image</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[#EB3678] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-[#180161] text-[#FB773C] divide-y divide-[#180161]">
              {#if $assets.length === 0}
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-gray-700">No assets available at the moment.</td>
                </tr>
              {/if}
              <!-- {#each $assets as asset (asset.id)} -->
              {#each $assets as asset (asset.assetId || `asset-${asset.assetName}`)}
                <tr>
                  <td class="px-6 py-4 border-b whitespace-nowrap">
                    {asset.assetName.length > 30 ? `${asset.assetName.slice(0, 20)}...` : asset.assetName}
                  </td>
                  <td class="px-6 py-4 border-b whitespace-nowrap">
                    {asset.description.length > 30 ? `${asset.description.slice(0, 30)}...` : asset.description}
                  </td>
                  <td class="px-6 py-4 border-b whitespace-nowrap">{asset.price}</td>
                  <td class="px-6 py-4 border-b whitespace-nowrap">{asset.category}</td>
                  <td class="px-6 py-4 border-b whitespace-nowrap">
                    <img src={asset.images} alt={asset.assetName} class="w-20 h-20 object-cover" />
                  </td>
                  <td class="px-6 py-4 border-b whitespace-nowrap">
                    <button on:click={() => handleAddToCart(asset.assetId)} class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#FB773C] transition-colors hover:bg-[#4F1787]">Add to Cart</button>
                    <button on:click={() => handleViewAsset(asset)} class="transform rounded-md border border-[#393ecb] px-7 py-3 font-medium text-[#eb3678] transition-colors hover:bg-[#393ecb]">View Asset</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
  
  
  
      {#if $showModal}
      <Modal on:close={closeModal}>
        {#if $selectedAsset}
          <h2 class="text-xl font-bold">{$selectedAsset.assetName}</h2>
          <p>{$selectedAsset.description}</p>
          <p>Price: ${$selectedAsset.price}</p>
          <p>Category: {$selectedAsset.category}</p>
          <div class="flex flex-wrap">
            {#each $selectedAsset.images || [] as image}
              <img src={image} alt="Asset image" class="w-32 h-32 object-cover m-2" />
            {/each}
          </div>
          <button on:click={() => handleAddToCart($selectedAsset.id)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">Add to Cart</button>
          <button on:click={closeModal} class="bg-gray-500 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded">Close</button>
        {/if}
      </Modal>
    {/if}
    </div> 
  </div>


  <style>
    .dropdown:focus-within .dropdown-menu {
      /* @apply block; */
      display:block;
    }
        </style>