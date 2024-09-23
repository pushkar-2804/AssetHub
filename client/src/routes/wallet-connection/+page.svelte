<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { writable, get } from 'svelte/store';
    import Footer from '../../lib/Footer.svelte';
      import Layout from "../+layout.svelte";
  
    let cartItems = [];
    let totalPrice = 0;
    let token;
    let dispatch = createEventDispatcher();

    let isAuthenticated = writable(false);
    let userMail = writable('');
    let neucronMail = writable('');
    let neucronPassword = writable('');
    let walletList = writable([]);
    let selectedWallet = writable('');
    let submitMail = writable(false);
    let successMessage = writable('');
    let errorMessage = writable('');
  
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
      } else {
        errorMessage.set('Failed to fetch user details. Please log in again.');
      }
    } catch (error) {
      errorMessage.set('An error occurred. Please try again.');
    }
  }

    async function handleSubmit(){
  
    try {
      const response = await fetch('http://localhost:3000/wallet/get-wallet-list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: $neucronMail, password: $neucronPassword })
      });
      if (response.ok) {
        const walletAddressData = await response.json();
        walletList.set(walletAddressData);
        console.log(walletAddressData);
        submitMail.set(true);
      } else {
        errorMessage.set('Failed to fetch user details. Please log in again.');
      }
    } catch (error) {
      errorMessage.set('An error occurred. Please try again.');
    }
    }

    async function connectWallet() {
    try {
      const walletId = $selectedWallet;
      const response = await fetch('http://localhost:3000/wallet/connect-wallet', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_id: walletId })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      successMessage.set('Wallet connected successfully!');
      errorMessage.set('');
      setTimeout(function(){ window.location.href = '/' }, 5000); 
    } catch (error) {
      errorMessage.set('Failed to connect wallet. Please try again.');
      successMessage.set('');
      console.error('Error connecting wallet:', error);
    }
  }

    onMount(() => {
      getUserProfile();
    });
  </script>
  
  <div class="grow h-dvh bg-indigo-900">
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
  
  <div class="flex justify-center">
  <div class="py-5 w-4/5">
      <div class="flex flex-col pb-8 w-full rounded-lg align-middle bg-[#180161] shadow-2xl">
          <div class="flex rounded-lg py-1.5 justify-center w-full">
              <p class="mt-1 mb-4 mx-5 text-[2.5rem] font-bold leading-[4rem] tracking-tight text-[#FB773C]">Connect Your Wallet</p>
          </div>
              {#if !$submitMail}
              <div class="mt-4 flex items-center justify-center gap-8 font-medium">
                {#if $errorMessage}
                  <div class="bg-red-200 text-red-800 p-2 rounded mb-4">{$errorMessage}</div>
                {/if}
                <form on:submit|preventDefault={handleSubmit}>
                  <div class="mb-4">
                    <label class="block text-[#FB773C] mb-2" for="email">Email</label>
                    <input class="w-full px-3 py-2  rounded text-[#FB773C] bg-[#4F1787]" type="email" id="email" bind:value={$neucronMail} required />
                  </div>
                  <div class="mb-4">
                    <label class="block text-[#FB773C] mb-2" for="password">Password</label>
                    <input class="w-full px-3 py-2 text-[#FB773C] bg-[#4F1787] rounded" type="password" id="password" bind:value={$neucronPassword} required />
                  </div>
                  <div class="mb-4">
                  <button class="w-full transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#FB773C] transition-colors hover:bg-[#4F1787]" type="submit">Login</button>
                </div>
                </form>
                </div>

                {:else}
                <div class="flex items-center justify-center">
                    <div class="flex basis-1/2 justify-end p-8">
                    <select bind:value={$selectedWallet} class="leading-4">
                      <option value="" disabled selected>Select your wallet</option>
                      {#each $walletList as wallet}
                        <option value={wallet.wallet_id}>
                          {wallet.wallet_id} - {wallet.paymail_id}
                        </option>
                      {/each}
                    </select>
                    </div>
                    <div class="flex basis-1/2 justify-center p-8">
                        <button on:click={connectWallet} class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#FB773C] transition-colors hover:bg-[#4F1787]">Connect Wallet</button>
                    </div>
                
                    {#if $successMessage}
                      <p style="color: green;">{$successMessage}</p>
                    {/if}
                    {#if $errorMessage}
                      <p style="color: red;">{$errorMessage}</p>
                    {/if}
                  </div>
              {/if}
                  
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