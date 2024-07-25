<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Table from '$lib/search-table.svelte';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  /** @type {import('./$types').PageData} */
  export let data;
  console.log("Initial data from server", data.assets);


  let options = [
      {
          text: `Gadget`
      },
      {
          text: `Deals`
      },
      {
          text: `Software`
      }
  ];

//   let selected;
  let selected = options[0].text
  let category = "";
  let price = "";

  let assets = data.assets; // Use the assets from the server-side load function
  let filterAssets = [];
  

  $: {
    // Recalculate the filtered assets whenever category or price changes
    filterAssets = assets.filter(asset => {
      const matchesCategory = category ? asset.category === category : true;
      const matchesPrice = price ? asset.price <= price : true;
      return matchesCategory && matchesPrice;
    });


    console.log("Category", filterAssets.matchesCategory);
    console.log("Price", filterAssets.matchesPrice)
    console.log("Filtered assets", filterAssets)
  }

  //  // Extract category and price from URL parameters
  //  $: {
  //   const url = new URL(page.url);
  //   category = url.searchParams.get('category') || '';
  //   price = parseFloat(url.searchParams.get('price')) || '';
  // }

    // Set category and price from URL parameters on page load
    onMount(() => {
    const url = new URL(page.url);
    category = url.searchParams.get('category') || '';
    price = parseFloat(url.searchParams.get('price')) || 0;
  });




  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (selected) {
      params.set("category", selected);
    }
    if (price) {
      params.set("price", price.toString());
    }
    console.log("Navigating to:", `/search?${params.toString()}`);
    goto(`/search?${params.toString()}`);


    async function handleSubmit() {
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });
  
        const data = await response.json();
        if (response.ok) {

          localStorage.setItem('token', data.access_token);
          dispatch('loginSuccess', data);
          window.location.href = '/';
        } else {
          errorMessage.set(data.message);
        }
      } catch (error) {
        errorMessage.set('An error occurred. Please try again.');
      }
    }



  };


</script>


<div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg">
  <form on:submit|preventDefault={handleSubmit} method="GET" action="?/filterasset">
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="category">
          Filter by Category
        </label>
        <select id="category" name="category" bind:value={selected} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          {#each options as option}
            <option value={option.text}>
              {option.text}
            </option>
          {/each}
        </select>
      </div>
      <div class="w-full px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="price">
          Filter by Price
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="price"
          type="number"
          placeholder="Enter price"
          bind:value={price}
        />
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-gray-700 text-white font-bold mt-5 ml-2 px-2 rounded">
        SEARCH
      </button>
    </div>
  </form>
</div>


<div>
  <h2><strong>Search Results</strong></h2>
  <Table filterAssets={filterAssets} />
</div>
