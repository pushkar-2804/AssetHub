<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Footer from "../lib/Footer.svelte";

  const errorMessage = writable('');
  const isAuthenticated = writable(false);
  const userMail = writable('');

  let token;
  let dispatch = createEventDispatcher();
  let data;

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

  async function fetchUserDetails() {

  checkAuthToken();

  if (!token) {
    isAuthenticated.set(false);
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


}

onMount(() => {
  fetchUserDetails();
});
</script>

<div class="bg-[#180161] h-dvh">
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

<section class="py-24 flex items-center justify-center bg-[#180161]">
  <div class="mx-auto max-w-[43rem]">
    <div class="text-center">
      <!-- <p class="text-lg font-medium leading-8 text-indigo-600/95">Introducing an Asset Marketplace</p> -->
      <h1 class="mt-3 text-[3.5rem] font-bold leading-[4rem] tracking-tight text-[#FB773C]">Browse, Buy and Sell Assets with Crypto</h1>
      <p class="mt-3 text-lg leading-relaxed text-slate-400">Welcome to AssetHub, your secure online marketplace for buying and selling assets using cryptocurrency seamlessly bridging traditional and digital markets.</p>
    </div>

    {#if !$isAuthenticated}
    <div class="mt-6 flex items-center justify-center gap-4">
      <a href="/login" class="transform rounded-md bg-indigo-600/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">Click here to Login</a>
    </div>
    {:else}
    <div class="mt-6 flex items-center justify-center gap-4">
      <a href="/asset-browsing" class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-white transition-colors hover:bg-[#4F1787]">Browse Assets</a>
      <a href="/asset-listing" class="transform rounded-md border border-[#393ecb] px-7 py-3 font-medium text-[#eb3678] transition-colors hover:bg-[#393ecb]"> List Assets </a>
    </div>
    {/if}
  </div>
</section>

<Footer/>
</div>

<style>
  .dropdown:focus-within .dropdown-menu {
    /* @apply block; */
    display:block;
  }
      </style>