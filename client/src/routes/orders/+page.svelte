<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { writable, get } from 'svelte/store';
    import Footer from '../../lib/Footer.svelte';
  
    let orders = [];
    let token;
    let dispatch = createEventDispatcher();
  
    const errorMessage = writable('');
    const isAuthenticated = writable(false);
    const userMail = writable('');
    const userId = writable('');
  
    function checkAuthToken() {
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
    }
  
    function handleLogout(){
        localStorage.removeItem('token');
        window.location.href = '/';
        dispatch('logout');
      }
  
    async function getUserProfile() {
  
    checkAuthToken();
  
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
        userId.set(userMailData.userId);
        fetchUserOrders();
      } else {
        errorMessage.set('Failed to fetch user details. Please log in again.');
      }
    } catch (error) {
      errorMessage.set('An error occurred. Please try again.');
    }
  }

  async function fetchUserOrders() {
      checkAuthToken();
  
      if (!token) {
        isAuthenticated.set(false);
        window.location.href = '/login';
      } else {
        isAuthenticated.set(true);
      }
  
      const userIdValue = get(userId);
      try {
        const response = await fetch(`http://localhost:3000/orders/${userIdValue}`, {
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
      orders = data.data.orders;
    //   totalPrice = data.totalPrice;
    console.log(data)
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }
  
    onMount(() => {
      getUserProfile();
    });
  </script>
  
  <div class="bg-indigo-900">
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
  
  <div class="flex justify-center h-dvh">
  <div class="py-5 w-4/5">
      <div class="flex flex-col w-full rounded-lg align-middle bg-[#180161]">
          <div class="flex rounded-lg py-1.5 justify-center w-full">
              <p class="mt-1 mb-4 mx-5 text-[2.5rem] font-bold leading-[4rem] tracking-tight text-[#FB773C]">Your Orders</p>
          </div>
          <div class="overflow-x-auto">
              {#if orders && orders.length>0}
              <table class="min-w-full rounded-lg ">
                <thead class="text-[#EB3678]">
                  <tr>
                    <th class="py-2 px-4 border-b ">Order ID</th>
                    <th class="py-2 px-4 border-b ">Asset Name</th>
                    <th class="py-2 px-4 border-b ">Quantity</th>
                    <th class="py-2 px-4 border-b ">Price</th>
                    <th class="py-2 px-4 border-b ">Transaction Id</th>
                    <th class="py-2 px-4 border-b ">Order Date</th>
                  </tr>
                </thead>
                <tbody class="text-[#FB773C]">
                  {#each orders as item}
                  <tr>
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">{item.orderId}</div></td>
                    <td class="px-6 py-4 border-b whitespace-nowrap">
                        {item.assetName.length > 15 ? `${item.assetName.slice(0, 15)}...` : item.assetName}
                      </td>
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">{item.quantity}</div></td>
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">{item.totalPrice}</div></td>
                    {#if item.bitcoinTransactionId!=null}
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">{item.bitcoinTransactionId}</div></td>
                    {:else}
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">N/A</div></td>
                    {/if}
                    <td class="py-2 px-4 border-b "><div class="flex justify-center">{item.orderDate}</div></td>
                  </tr>
                  {/each}
                </tbody>
                <tfoot>
                  <!-- <tr>
                    <td  class="py-8 px-4 border-t font-bold"><div class="flex justify-center">Total Price:</div></td>
                    <td  class="py-8 px-4 border-t font-bold"></td>
                    <td  class="py-8 px-4 border-t font-bold"></td>
                    <td  class="py-8 px-4 border-t font-bold"><div class="flex justify-center">{totalPrice} SATS</div></td>
                  </tr> -->
                </tfoot>
              </table>
              <footer class="p-8">
                <div class="mt-4 flex items-center justify-center gap-4">
                    <a href="/asset-browsing" class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#ff347f] transition-colors hover:bg-[#4F1787]">Click here to Browse Assets</a>
                  </div>
              </footer>
              {:else}
              <div class="flex rounded-lg py-1.5 justify-center w-full h-10">
                  <p class="mx-3 text-bold text-lg leading-relaxed text-[#FB773C]">Looks like your cart is empty!</p>
              </div>
              <footer class="p-8">
                  <div class="mt-4 flex items-center justify-center gap-4">
                    <a href="/asset-browsing" class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#FB773C] transition-colors hover:bg-[#4F1787]">Click here to Browse Assets</a>
                    </div>
              </footer>
              {/if}
            </div>
      </div>
  </div>
  </div>
  
  </div>
  
  
  <style>
    .dropdown:focus-within .dropdown-menu {
      /* @apply block; */
      display:block;
    }
        </style>