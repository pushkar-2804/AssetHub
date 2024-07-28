<script>
	import Modal from "./Modal.svelte";
	let showModal = false;
	// let editableUser = { id: null ,name: "", description: "" };
	let selectedAsset = null;
	export let data;
	export let form;
  
	// const handleUpdate = (data) => {
	//   showModal = true;
	//   editableUser = { ...data };
	//   console.log(editableUser);
	// };
  
	const handleViewAsset = (assets) => {
    showModal = true;
    selectedAsset = { ...assets };
    console.log(selectedAsset);
  };
  


  const handleAddToCart = async (assetId) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const result = await response.json();
      console.log('Item added to cart:', result);
      // Optionally update cart state/store here
    } catch (error) {
      console.error(error);
    }
  };


  </script>
  
  <div
	class="mt-10 pt-10 w-full max-w-xl p-5 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
	<div class="flex items-center justify-between mb-4">
	  <div class="space-y-1">
		<h2 class="text-xl font-semibold">List of Assets</h2>
		<!-- <p class="text-sm text-gray-500">Fetched {data.length} Assets</p> -->
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
			<td class="px-6 py-4 whitespace-nowrap">{asset.name}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.description}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.price}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.category}</td>
			<td class="px-6 py-4 whitespace-nowrap">{asset.image}</td>
			<td class="px-6 py-4 whitespace-nowrap">

				<button on:click={() => handleAddToCart(asset.id)}>Add to Cart</button>
            	<button on:click={() => handleViewAsset(asset)}>View Asset</button>

			  <!-- <form method="POST" action="/profiles?/delete" class="inline-block">
				<input type="hidden" name="id" value={asset.id} />
				<button type="submit">
					Add to Cart
				   <img class="w-4 inline" src="./trash-can.svg" alt="delete" />
				</button>
			  </form> -->
			  <!-- <form method="POST" action="/asset-listing?/viewasset" class="inline-block">
				<input type="hidden" name="id" value={asset.id} />
				<button type="submit">
					View Asset
				   <img class="w-4 inline" src="./trash-can.svg" alt="delete" />
				</button>
			  </form> -->

			  <!-- <form method="GET" class="inline-block ml-4">
				<button type="submit" on:click={() => handleUpdate(asset)}>
				   View Asset
				</button>
			  </form> -->
			</td>
		  </tr>
		{/each}
	  </tbody>
	</table>
  </div>
  
  <br>

  <Modal bind:showModal>
	{#if selectedAsset}
	  <h2 class="font-semibold text-lg">Asset Details</h2>
	  <table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-yellow-400">
		  <tr>
			<th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
			<th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
			<th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
			<th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
			<th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
		  </tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
		  <tr>
			<td class="px-6 py-4 whitespace-nowrap">{selectedAsset.name}</td>
			<td class="px-6 py-4 whitespace-nowrap">{selectedAsset.description}</td>
			<td class="px-6 py-4 whitespace-nowrap">{selectedAsset.price}</td>
			<td class="px-6 py-4 whitespace-nowrap">{selectedAsset.category}</td>
			<td class="px-6 py-4 whitespace-nowrap">{selectedAsset.image}</td>
		  </tr>
		</tbody>
	  </table>
	{/if}
  </Modal>



  <br>



  <!-- <Modal bind:showModal>
	<h2 slot="header" class="font-semibold text-lg">Asset</h2>
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-yellow-400">
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
		  {#each assets as asset (asset.id)}
			<tr>
			  <td class="px-6 py-4 whitespace-nowrap">{asset.name}</td>
			  <td class="px-6 py-4 whitespace-nowrap">{asset.description}</td>
			  <td class="px-6 py-4 whitespace-nowrap">{asset.price}</td>
			  <td class="px-6 py-4 whitespace-nowrap">{asset.categoryn}</td>
			  <td class="px-6 py-4 whitespace-nowrap">{asset.image}</td>
			  <td class="px-6 py-4 whitespace-nowrap">
				<form method="POST" action="/asset-listing?/viewasset" class="inline-block">
				  <input type="hidden" name="id" value={asset.id} />
				  <button type="submit">
					  Add to Cart
					<img class="w-4 inline" src="./trash-can.svg" alt="delete" />
				  </button>
				</form>
				 <form method="GET" class="inline-block ml-4">
				  <button type="submit" on:click={() => handleUpdate(asset)}>
					 View Asset
				  </button>
				</form>
			  </td>
			</tr>
		  {/each}
		</tbody>
	  </table>
	 {#if form?.success} 
	 this message is ephemeral; it exists because the page was rendered in
	   response to a form submission. it will vanish if the user reloads 
	 <p class="pt-2 text-green-600 font-semibold">Applicant Updated!</p> 
   {/if}
  </Modal> -->