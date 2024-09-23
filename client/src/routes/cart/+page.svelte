<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable, get } from 'svelte/store';
  import Footer from '../../lib/Footer.svelte';

  let cartItems = [];
  let totalPrice = 0;
  let token;
  let dispatch = createEventDispatcher();

  const errorMessage = writable('');
  const isAuthenticated = writable(false);
  const userMail = writable('');
  const editingItem = writable(null); // Store for editing item

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

  async function fetchUserCart() {
    checkAuthToken();

    if (!token) {
      isAuthenticated.set(false);
      window.location.href = '/login';
    } else {
      isAuthenticated.set(true);
    }

    try {
      const response = await fetch('http://localhost:3000/cart/view', {
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

  async function updateCartItem(cartItemId, quantity) {
    try {
      const response = await fetch('http://localhost:3000/cart/update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItemId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Update successful', data);

      window.location.reload();

      // Update the local cartItems array
      const itemIndex = cartItems.findIndex(item => item.cartItemId === cartItemId);
      if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = quantity;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  }

  function startEditing(item) {
    editingItem.set({ ...item });
  }

  function cancelEditing() {
    editingItem.set(null);
  }

  function deleteCartItem(item) {
    updateCartItem(item.cartItemId, 0);
  }

  async function saveEditing() {
    const editedItem = get(editingItem);
    await updateCartItem(editedItem.cartItemId, editedItem.quantity);
    editingItem.set(null);
  }

  onMount(() => {
    getUserProfile();
    fetchUserCart();
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

<div class="flex justify-center ">
<div class="py-5 w-4/5">
    <div class="flex flex-col w-full  rounded-lg align-middle bg-[#180161]">
        <div class="flex rounded-lg py-1.5 justify-center w-full">
            <p class="mt-1 mb-4 mx-5 text-[2.5rem] font-bold leading-[4rem] tracking-tight text-[#FB773C]">Your Cart Items</p>
        </div>
        <div class="overflow-x-auto">
            {#if totalPrice!=0}
            <table class="min-w-full rounded-lg">
              <thead class="text-[#EB3678]">
                <tr>
                  <th class="py-2 px-4 border-b">Asset ID</th>
                  <th class="py-2 px-4 border-b">Asset Name</th>
                  <th class="py-2 px-4 border-b">Quantity</th>
                  <th class="py-2 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody class="text-[#FB773C]">
                {#each cartItems as item}
                  <tr>
                    <td class="py-2 px-4 border-b"><div class="flex justify-center">{item.assetId}</div></td>
                    <td class="py-2 px-4 border-b"><div class="flex justify-center">{item.assetName}</div></td>
                    <td class="py-2 px-4 border-b">
                      {#if $editingItem && $editingItem.cartItemId === item.cartItemId}
                      <div class="flex justify-center">
                      <input type="number" min="1" bind:value={$editingItem.quantity} class="border rounded px-2 py-1" />
                      <button on:click={saveEditing} class="ml-2 text-blue-500">Save</button>
                      <button on:click={cancelEditing} class="ml-2 text-red-500">Cancel</button>
                    </div>
                      {:else}
                  <div>
                    <div class="flex flex-row">
                      <div class="flex basis-1/2 justify-end">
                        <div class="flex">
                        <p>
                         {item.quantity}
                       </p>
                      </div>
                      </div>
                      <div class="flex basis-1/2 justify-end">
                        <div class="flex">
                          <button on:click={() => startEditing(item)} class="ml-2">
                            <img class="w-7 inline hover:bg-gray-200 rounded-md p-1" src="./edit-icon.svg" alt="update" />
                          </button>
                        </div>
                        <div class="flex">
                          <button on:click={() => deleteCartItem(item)} class="ml-2">
                            <img class="w-7 inline hover:bg-gray-200 rounded-md p-1" src="./trash-can.svg" alt="update" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                      {/if}
                    </td>
                    <td class="py-2 px-4 border-b"><div class="flex justify-center">{item.price} SATS</div></td>
                  </tr>
                {/each}
              </tbody>
              <tfoot class="text-[#EB3678]">
                <tr>
                  <td  class="py-8 px-4 border-t font-bold"><div class="flex justify-center">Total Price:</div></td>
                  <td  class="py-8 px-4 border-t font-bold"></td>
                  <td  class="py-8 px-4 border-t font-bold"></td>
                  <td  class="py-8 px-4 border-t font-bold"><div class="flex justify-center">{totalPrice} SATS</div></td>
                </tr>
              </tfoot>
            </table>
            <footer class="p-8">
                <div class="mt-4 flex items-center justify-center gap-4">
                    <a href="/checkout" class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#ff347f] transition-colors hover:bg-[#4F1787]">Checkout</a>
                  </div>
            </footer>
            {:else}
            <div class="flex rounded-lg py-1.5 justify-center w-full h-10">
                <p class="mx-3 text-bold text-lg leading-relaxed text-[#FB773C]">Looks like your cart is empty!</p>
            </div>
            <footer class="p-8">
                <div class="mt-4 flex items-center justify-center gap-4">
                    <a href="/asset-browsing" class="transform rounded-md bg-[#8236eb9f] px-5 py-3 font-medium text-[#ff347f] transition-colors hover:bg-[#4F1787]">Click here to Browse Assets</a>
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