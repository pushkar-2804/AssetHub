<script lang="ts">
      import { createEventDispatcher } from 'svelte';
      import { writable } from 'svelte/store';
      // const errorMessage = writable('');
      import { onMount } from 'svelte';
      const dispatch = createEventDispatcher();

    import Table from "$lib/Table.svelte";

    let assetName: '';
    let description: '';
    let price: '';
    let category: '';
    let images: [];
    let userId: '1';
  
    // /** @type {import('./$types').PageData} */
    export let data;
    // console.log("hello", data.assets);
  
    /** @type {import('./$types').ActionData} */
    export let form;


    let options = [
      {
          text: `GADGET`
      },
      {
          text: `DEAL`
      },
      {
          text: `SOFTWARE`
      }
  ];

//   let selected;
  let selected = options[0].text

  // async function handleSubmit() {
  //     try {
  //       const response = await fetch('http://localhost:3000/assets/browse', {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  
  //       const data = await response.json();
  //       if (response.ok) {
  //         // localStorage.setItem('token', data.token);
  //         dispatch('AssetBrowseSuccess', data);
  //         // goto('/');
  //       } else {
  //         errorMessage.set(data.message);
  //       }
  //     } catch (error) {
  //       errorMessage.set('An error occurred. Please try again.');
  //     }
  //   }




    async function handleSubmit(){
    try {
      const response = await fetch(`'http://localhost:3000/assets/browse'`, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      assetName = data.assetName;
      description = data.description;
      price = data.price;
      category = data.category;
      images = data.images;
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }

 


  // async function getAssets(){
  //   try {
  //     const response = await fetch('http://localhost:3000/assets/browse', {
  //       method: 'GET',
  //       headers: {
  //         // 'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.ok) {
  //       data = await response.json();
  //       console.log(data);
    
  //   } catch (error) {
  //     // isAuthenticated.set(false);
  //     errorMessage.set('An error occurred. Please try again.');
  //   }
  //  }



  async function fetchAssetDetail(){
    try {
      const response = await fetch(`http://localhost:3000/assets/details/${userId}`, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error fetching asset data:', error);
    }
  }



  onMount(() => {
    fetchAssetDetail();
  });


  </script>
  


  
<div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg">
  <form method="get" on:submit|preventDefault={handleSubmit}>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-city"
        >
          Filter by
        </label>
        <select id="category" name="category"
                bind:value={selected}>
                {#each options as option}
                    <option value={option.text}>
                        {option.text}
                    </option>
                {/each}
        </select>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="price"
          type="number"
          placeholder="Enter price"
          name="price"
        />
      </div>
    
      <button type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-5 ml-2 px-2 rounded ">
        SEARCH
      </button>
    </div>
  </form>
</div>


<!-- <Table assets={data.assets} /> -->


<div
	class="mt-10 pt-10 w-full max-w-xl p-5 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
	<div class="flex items-center justify-between mb-4">
	  <div class="space-y-1">
		<h2 class="text-xl font-semibold">List of Assets</h2>
		<p class="text-sm text-gray-500">Fetched {data.length} Assets</p>
	  </div>
	</div>

	<table class="min-w-full divide-y divide-gray-200">
	  <thead class="bg-blue-400">
		<tr>
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Name</th
		  >
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Description</th
		  >
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Price</th
		  >
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Category</th
		  >
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Image</th
		  >
		  <th
			class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
			>Actions</th
		  >
		</tr>
	  </thead>
	  <tbody class="bg-white divide-y divide-gray-200">
		{#each data as asset (asset.id)}
		  <tr>
			<td class="px-6 py-4 whitespace-nowrap">{asset.assetName}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.description}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.price}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.category}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.image}</td>
			<td class="px-6 py-4 whitespace-nowrap">

				<button on:click={() => handleAddToCart(asset.id)}>Add to Cart</button>
        <button on:click={() => handleViewAsset(asset)}>View Asset</button>

			</td>
		  </tr>
		{/each}
	  </tbody>
	</table>
  </div>