<script>
  import { createEventDispatcher, onMount } from "svelte";
  import {writable} from 'svelte/store';
  import Footer  from '$lib/Footer.svelte';

  function handleLogout() {
      const dispatch = createEventDispatcher();
      // Remove JWT token from local storage
    localStorage.removeItem('token');
    
    // Redirect to the home page
    window.location.href = '/';
      dispatch('logout');
}

const errorMessage = writable('');
  const isAuthenticated = writable(false);
  const userMail = writable('');
  let userId = '';
  let cartItems = [];
  let totalPrice = 0;

  let token;
  let dispatch = createEventDispatcher();
  let data;

  function checkAuthToken() {
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
}


  async function fetchUserDetails() {

  checkAuthToken();

  if (!token) {
    isAuthenticated.set(false);
    window.location.href = '/login';
    // return;
  }
  else {
      isAuthenticated.set(true);
      // return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      data = await response.json();
      console.log(data);
      userId = data.userId;
      // isAuthenticated.set(true);
    } else {
      // isAuthenticated.set(false);
      errorMessage.set('Failed to fetch user details. Please log in again.');
    }
  } catch (error) {
    // isAuthenticated.set(false);
    errorMessage.set('An error occurred. Please try again.');
  }

  try{
    const response = await fetch('http://localhost:3000/users/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: data.userId
      })
    });
    if (response.ok){
      const userMailData = await response.json();
      console.log(userMail);
      userMail.set(userMailData.email);
      // isAuthenticated.set(true);
    } else {
      // isAuthenticated.set(false);
      errorMessage.set('Failed to fetch user details. Please log in again.');
    }
  } catch (error) {
    // isAuthenticated.set(false);
    errorMessage.set('An error occurred. Please try again.');
  }

  fetchUserCart();

}

async function fetchUserCart(){
  try {
    const response = await fetch(`http://localhost:3000/cart/view?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    cartItems = data.cartItems;
    totalPrice = data.totalPrice;
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
}



onMount(() => {
  fetchUserDetails();
});
</script>

<div class="grow h-screen bg-gray-100">
<nav class="bg-white border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="./AssetHub.svg" class="h-8" alt="AssetHub Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AssetHub</span>
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
      <div class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
        {#if $isAuthenticated}
        <div class="px-4 py-3">
          <p class="text-sm leading-5">Signed in as</p>
          <p class="text-sm font-medium leading-5 text-gray-900 truncate">{$userMail}</p>
        </div>
        {/if}
        <div class="py-1">
          <a href="/dashboard" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Dashboard</a>
          <a href="#" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Wallet connection</a>
          <!-- <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span> -->
          <a href="/profile-settings" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >Account settings</a></div>
        <div class="py-1">
          <form on:submit={handleLogout}>
            <button type="submit" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  </div> 
  {/if}
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
    <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="/" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="asset-listing" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Asset Listing</a>
      </li>
      <li>
        <a href="asset-browsing" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Browse Assets</a>
      </li>
      <li>
        <a href="/cart" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Cart</a>
      </li>
    </ul>
  </div>
  </div>
</nav>

<div class="flex justify-center">
<div class="py-5 w-4/5">
  <div class="flex flex-col w-full rounded-lg align-middle bg-white">
      <div class="flex rounded-lg py-1.5 justify-Left w-full">
          <p class="mt-1 mx-5 text-[2.5rem] font-bold leading-[4rem] tracking-tight text-black">Your Cart Items:</p>
      </div>
      <div class="overflow-x-auto">
          {#if totalPrice=0}
          <table class="min-w-full rounded-lg">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b">Asset ID</th>
                <th class="py-2 px-4 border-b">Asset Name</th>
                <th class="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {#each cartItems as item}
                <tr>
                  <td class="py-2 px-4 border-b">{item.assetId}</td>
                  <td class="py-2 px-4 border-b">{item.assetName}</td>
                  <td class="py-2 px-4 border-b">${item.price}</td>
                </tr>
              {/each}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="py-2 px-4 border-t font-bold">Total Price</td>
                <td class="py-2 px-4 border-t font-bold">${totalPrice}</td>
              </tr>
            </tfoot>
          </table>
          <footer class="p-8">
              <div class="mt-6 flex items-center justify-center gap-4">
                  <a href="#" class="transform rounded-md bg-indigo-600/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">Checkout</a>
                </div>
          </footer>
          {:else}
          <div class="flex rounded-lg py-1.5 justify-center w-full h-10">
              <p class="mx-3 text-bold text-lg leading-relaxed text-slate-800">Looks like your cart is empty!</p>
          </div>
          <footer class="p-8">
              <div class="mt-6 flex items-center justify-center gap-4">
                  <a href="#" class="transform rounded-md bg-indigo-600/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">Click here to Browse Assets</a>
                </div>
          </footer>
          {/if}
        </div>
  </div>
</div>
</div>

<Footer/>

</div>


<style>
  .dropdown:focus-within .dropdown-menu {
    /* @apply block; */
    display:block;
  }
      </style>