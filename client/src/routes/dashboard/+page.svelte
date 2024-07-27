<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    function logout() {
      // Remove JWT token from local storage
      localStorage.removeItem('token');
  
      // Redirect to the home page
      window.location.href = '/';
      dispatch('logout');
    }
  </script>



<div class="flex flex-row">
<aside class="min-h-screen bg-gray-100">
    <div class="sidebar min-h-screen overflow-hidden border-r w-56 hover:bg-white hover:shadow-lg">
      <div class="flex h-screen flex-col justify-between pt-2 pb-6">
        <div>
            <div class="w-max p-3">
                <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="./AssetHub.svg" class="h-8" alt="AssetHub Logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AssetHub</span>
                </a>
              </div>
          <ul class="mt-6 space-y-2 tracking-wide">
            <li class="min-w-max">
              <a href="#" aria-label="dashboard" class="relative flex items-center space-x-4 bg-gradient-to-r from-blue-700 to-sky-600 px-4 py-3 text-white">
                <span class="-mr-1 font-medium">Dashboard</span>
              </a>
            </li>
            <li class="min-w-max">
              <a href="#" class="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd" />
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span class="group-hover:text-gray-700">Browse Assets</span>
              </a>
            </li>
            <li class="min-w-max">
              <a href="#" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                <span class="group-hover:text-gray-700">List Asset</span>
              </a>
            </li>
            <li class="min-w-max">
                <a href="#" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path class="fill-current text-gray-600 group-hover:text-cyan-600" fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="group-hover:text-gray-700">Wallet Connection</span>
                </a>
              </li>
            <li class="min-w-max">
              <a href="#" class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path class="fill-current text-gray-600 group-hover:text-cyan-600" d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path class="fill-current text-gray-300 group-hover:text-cyan-300" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span class="group-hover:text-gray-700">Profile Settings</span>
              </a>
            </li>
           
          </ul>
        </div>
        <div class="w-max -mb-3">
          <button on:click={logout} class="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600">
            <img src="./logout.svg" class="h-5 w-5 group-hover:fill-cyan-600" alt="logout" />
            <span class="group-hover:text-gray-700">Sign out</span>
          </button>
        </div>
      </div>
    </div>
</aside>








 <div class="flex flex-col w-full bg-white border-gray-200 dark:bg-gray-900">
    <div class="flex">
      <div class="flex flex-row w-full font-medium justify-end p-6 border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div class="py-2 px-3">
          <a href="#" class="mx-1.5 py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
        </div>
        <div class="py-2 px-3">
          <a href="#" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Asset Listing</a>
        </div>
        <div class="py-2 px-3">
          <a href="#" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Browse Assets</a>
        </div>
        <div class="py-2 px-3">
          <a href="#" class="mx-1.5 py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Cart</a>
        </div>
    </div>
    </div>


    <div class="flex flex-wrap w-full h-full bg-gradient-to-r from-blue-700 to-sky-600">
        <div class="py-2 px-3 w-full h-1/2">
            <div class="flex justify-center w-full h-full rounded-lg bg-slate-200">
                <div class="flex justify-center w-full h-10 bg-gray-100">
                    <h1>Your Profile</h1>
                </div>
            </div>
        </div>
        <div class="py-2 px-3 w-1/2 h-1/2">
            <div class="flex justify-center w-full h-full rounded-lg bg-slate-200">
                <div class="flex justify-center w-full h-10 bg-gray-100">
                    <h1>Your Cart Items</h1>
                </div>
            </div>
        </div>
        <div class="py-2 px-3 w-1/2 h-1/2">
            <div class="flex justify-center w-full h-full rounded-lg bg-slate-200">
                <div class="flex justify-center w-full h-10 bg-gray-100">
                    <h1>Your Asset Listing</h1>
                </div>
            </div>
        </div>

    </div>


 </div>
</div>