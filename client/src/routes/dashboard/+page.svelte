<script>
    import { createEventDispatcher, onMount } from "svelte";
    import {writable} from 'svelte/store';

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
      const response = await fetch(`http://localhost:3000/cart/view`, {
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



<div class="flex flex-row">
<aside class="grow bg-gray-100">
    <div class="sidebar h-full overflow-hidden border-r w-56 hover:bg-white hover:shadow-lg">
      <div class="flex h-full flex-col justify-between pt-2 pb-6">
        <div>
            <div class="w-max p-3">
                <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="./AssetHub.svg" class="h-8" alt="AssetHub Logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AssetHub</span>
                </a>
              </div>
          <ul class="mt-6 space-y-2 tracking-wide">
            <li class="min-w-max">
              <a href="#" aria-label="dashboard" class="relative flex items-center space-x-4 bg-gradient-to-r from-gray-600 to-slate-300 px-4 py-3 text-white">
                <span class="-mr-1 font-medium">Dashboard</span>
              </a>
            </li>
            <li class="min-w-max">
              <a href="/asset-browsing" class="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd" />
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span class="group-hover:text-gray-700">Browse Assets</span>
              </a>
            </li>
            <li class="min-w-max">
              <a href="/my-assets" class="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd" />
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span class="group-hover:text-gray-700">My Assets</span>
              </a>
            </li>
            <li class="min-w-max">
              <a href="/asset-listing" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                <span class="group-hover:text-gray-700">List Asset</span>
              </a>
            </li>
            <li class="min-w-max">
                <a href="/wallet-connection" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path class="fill-current text-gray-600 group-hover:text-cyan-600" fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="group-hover:text-gray-700">Wallet Connection</span>
                </a>
              </li>
            <li class="min-w-max">
              <a href="/profile-settings" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span class="group-hover:text-gray-700">Profile Settings</span>
              </a>
            </li>
           
          </ul>
        </div>
        <footer class="w-max -mb-3">
          <button on:click={handleLogout} class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
            <img src="./logout.svg" class="h-5 w-5 group-hover:fill-cyan-600" alt="logout" />
            <span class="group-hover:text-gray-700">Sign out</span>
          </button>
        </footer>
      </div>
    </div>
</aside>








 <div class="flex flex-col w-full bg-white dark:bg-gray-900">
    <div class="flex">
      <div class="flex flex-row w-full font-medium justify-end p-6  bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div class="py-2 px-3">
          <a href="/" class="mx-1.5 py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
        </div>
        <div class="py-2 px-3">
          <a href="/asset-listing" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Asset Listing</a>
        </div>
        <div class="py-2 px-3">
          <a href="/asset-browsing" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Browse Assets</a>
        </div>
        <div class="py-2 px-3">
          <a href="/my-assets" class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">My Assets</a>
        </div>
        <div class="py-2 px-3">
          <a href="/cart" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Cart</a>
        </div>
    </div>
    </div>


    <div class="flex flex-wrap grow font-medium w-full rounded-xl p-1 h-screen bg-gradient-to-r from-blue-700 to-sky-600">
        <div class="flex flex-row flex-wrap justify-center py-2 px-3 rounded-lg w-full h-1/2">
            <section class="py-20 flex items-center justify-center rounded-lg bg-white">
                <div class="mx-auto w-full">
                  <div class="text-left">
                    <!-- <p class="text-lg font-medium leading-8 text-indigo-600/95">Introducing an Asset Marketplace</p> -->
                    <h1 class="mt-1 mx-5 text-[3.5rem] font-bold leading-[4rem] tracking-tight text-black">Hello, {$userMail}</h1>
                    <p class="mt-3 mx-5 text-lg leading-relaxed text-slate-400">Welcome to AssetHub, your secure online marketplace for buying and selling assets using cryptocurrency seamlessly bridging traditional and digital markets.</p>
                  </div>
                  <div class="mt-6 flex items-center justify-center gap-4">
                    <a href="/asset-browsing" class="transform rounded-md bg-indigo-600/95 px-5 py-3 font-medium text-white transition-colors hover:bg-indigo-700">Browse Assets</a>
                    <a href="/asset-listing" class="transform rounded-md border border-slate-200 px-7 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50"> List Assets </a>
                  </div>
                </div>
              </section>

              <div class="py-2 w-full h-full">
                <div class="flex flex-col w-full h-full rounded-lg bg-white">
                    <div class="flex rounded-lg py-1.5 justify-Left w-full h-10">
                        <p class="mx-3 text-bold font-medium text-xl leading-relaxed text-slate-800">Your Cart Items:</p>
                    </div>
                    <div class="overflow-x-auto bg-white">
                        {#if totalPrice= 0}
                        <table class="min-w-full rounded-lg bg-white">
                          <thead>
                            <tr>
                              <th class="py-2 px-4 border-b">Asset ID</th>
                              <th class="py-2 px-4 border-b">Asset Name</th>
                              <th class="py-2 px-4 border-b">Quantity</th>
                              <th class="py-2 px-4 border-b">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each cartItems as item}
                              <tr>
                                <td class="py-2 px-4 border-b">{item.assetId}</td>
                                <td class="py-2 px-4 border-b">{item.assetName}</td>
                                <td class="py-2 px-4 border-b">{item.quantity}</td>
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
                        {:else}
                        <div class="flex rounded-lg py-1.5 justify-center w-full h-10 mt-20">
                            <p class="mx-3 text-bold text-lg leading-relaxed text-slate-800">Looks like your cart is empty!  <a href="/asset-browsing" class="text-blue-500">Click Here</a> to check out our store</p>
                        </div>
                        
                        {/if}
                      </div>
                </div>
            </div>
              </div>
        

    </div>


 </div>
</div>

<style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      border: 1px solid #ccc;
      text-align: left;
    }
    th {
      background-color: #f9f9f9;
    }
  </style>