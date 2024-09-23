<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  // export let form;
  import { createEventDispatcher } from 'svelte';

  let form: HTMLFormElement | null = null;
  let imageInput: HTMLInputElement | null = null;
  
  function handleLogout() {
      const dispatch = createEventDispatcher();
      // Remove JWT token from local storage
      localStorage.removeItem('token');
  
      // Redirect to the home page
      window.location.href = '/';
      dispatch('logout');
    }


    let options = [
      { text: 'GADGET' },
      { text: 'DEAL' },
      { text: 'SOFTWARE' },
    ];  

  const assetName = writable('');
  const description = writable('');
  const price = writable('');
  const category = writable('GADGET');
  const isAuthenticated = writable(false);
  const userMail = writable('');
  const errorMessage = writable('');
  const successMessage = writable('');
  let token: string | null = null;

  onMount(() => {
    token = localStorage.getItem('token');
     auth();
    });
  
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

  async function handleSubmit(event: Event) {
    console.log(token)
    event.preventDefault();

    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!imageInput.files?.length) {
      errorMessage.set('Please fill in all the fields.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', '1'); // Adjust accordingly
    formData.append('assetName', $assetName);
    formData.append('description', $description);
    formData.append('price', $price);
    formData.append('category', $category);

    for (const file of imageInput.files) {
      formData.append('images', file);
    }

    try {
      const response = await fetch('http://localhost:3000/assets/list', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Asset created successfully:', result);
      successMessage.set('Asset Listed successfully!');
        errorMessage.set('');

      // Reset form fields
      assetName.set('');
      description.set('');
      price.set('');
      category.set('GADGET');
      if (imageInput) {
        imageInput.value = '';
      }
      errorMessage.set('');
    } catch (error) {
      console.error('Error creating asset:', error);
      errorMessage.set('Failed to create asset. Please try again.');
    }
  }
</script>



<div class="grow bg-indigo-900 pb-5">
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



<div
class="mt-10 mb-8 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-[#180161] ring-1 ring-gray-900/5 backdrop-blur-lg"
>
<form bind:this={form} on:submit|preventDefault={handleSubmit}>
  <div class="flex flex-wrap justify-center text-[#FB773C] -mx-3 mb-2">
    <div class="font-bold text-4xl"><h1>Create New Assets</h1></div>
    <br>
    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-[#FB773C] text-xs font-bold mb-2"
        for="assetName"
      >
        Asset Name
      </label>
      <input
        class="appearance-none block w-full border-[#8236eb9f] bg-[#8236eb9f] text-[#EB3678] rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="assetName"
        type="text"
        placeholder="Enter asset name "
        bind:value={$assetName}
      />
    </div>
    <br>
    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-[#FB773C] text-xs font-bold mb-2"
        for="description"
      >
        Enter the description
      </label>
      <input
        class="appearance-none block w-full border-[#8236eb9f] bg-[#8236eb9f] rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="description"
        type="text"
        placeholder="Enter description"
        bind:value={$description}
      />
    </div>

    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-[#FB773C] text-xs font-bold mb-2"
        for="price"
      >
        Enter price
      </label>

      <input
        class="appearance-none block w-full border-[#8236eb9f] bg-[#8236eb9f] rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="price"
        type="number"
        placeholder="Enter price"
        bind:value={$price}
      />
    </div>
    <br>
    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-[#FB773C] text-xs font-bold mb-2"
        for="category"
      >
        Category
      </label>
      <select id="category" bind:value={$category}>
        {#each options as option}
          <option value={option.text}>
            {option.text}
          </option>
        {/each}
      </select>
    </div>

    <br>

    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-[#FB773C] text-xs font-bold mb-2"
        for="images"
      >
        Image Upload
      </label>

      <input
        class="appearance-none block w-full border-[#8236eb9f] bg-[#8236eb9f] rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="images"
        type="file"
        placeholder="Upload Image"
        bind:this={imageInput} multiple
      />
    </div>   
    <br> 
    <!-- <button
      type="submit"
      class="bg-blue-500 hover:bg-gray-700 text-white font-bold mt-5 ml-2 px-2 rounded " on:click={handleSubmit}
    >
      Create Asset
    </button> -->
    <footer class="p-8 w-full">
      <div class="mt-4 flex items-center justify-center gap-4">
          {#if $successMessage}
            <p style="color: green;">{$successMessage}</p>
          {/if}
          {#if $errorMessage}
            <p style="color: red;">{$errorMessage}</p>
          {/if}
      </div>
        <div class="mt-4 flex items-center justify-center gap-4">
            <form on:submit={handleSubmit}>
              <button type="submit" class="submit-button text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " role="menuitem">
                Create Asset
              </button>
            </form>
          </div>
    </footer>
  </div>

  {#if form?.success}
    <p class="pt-2">Asset was created successfully!!!</p> 
  {/if}
</form>
</div>
</div>

<style>
  .dropdown:focus-within .dropdown-menu {
    /* @apply block; */
    display:block;
  }
      </style>