<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const errorMessage = writable('');
    const isAuthenticated = writable(false);

    let token;

    function checkAuthToken() {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
  }

    async function fetchUserDetails() {

    checkAuthToken();

    if (!token) {
      isAuthenticated.set(false);
      return;
    }
    else {
        isAuthenticated.set(true);
        return;
    }

    // try {
    //   const response = await fetch('http://localhost:3000/api/user/profile', {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     isAuthenticated.set(true);
    //   } else {
    //     isAuthenticated.set(false);
    //     errorMessage.set('Failed to fetch user details. Please log in again.');
    //   }
    // } catch (error) {
    //   isAuthenticated.set(false);
    //   errorMessage.set('An error occurred. Please try again.');
    // }
  }

  onMount(() => {
    fetchUserDetails();
  });
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="./AssetHub.svg" class="h-8" alt="AssetHub Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AssetHub</span>
    </a>
    {#if $isAuthenticated}
    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <form action="/profile">
            <button type="submit" class="submit-button text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View Profile</button>
        </form>
    </div>
    {:else}
    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <form action="/login">
            <button type="submit" class="submit-button text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
        </form>
    </div>
    {/if}
    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
      <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="#" class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Asset Listing</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Browse Assets</a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Cart</a>
        </li>
      </ul>
    </div>
    </div>
  </nav>
  