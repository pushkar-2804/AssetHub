<script lang="ts">
    import Table from "$lib/Table.svelte";
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    export let form;
    
    const errorMessage = writable('');
    const dispatch = createEventDispatcher();


    async function handleSubmit() {
      try {
        const response = await fetch('http://localhost:3000/asset/browse', {
          method: 'GET',
        });
  
        const data = await response.json();
        console.log(data);
    
        if (response.ok) {
          dispatch('AssetBrowseSuccess', data);
          window.location.href = '/';
        } else {
          errorMessage.set(data.message);
        }
      } catch (error) {
        errorMessage.set('An error occurred. Please try again.');
      }
    }
   
    /** @type {import('./$types').PageData} */
    export let data;
        console.log(data); 
        let name = data.name;
        let description = data.description;
        let price = data.price;
        let category = data.category;
        let image = data.image;

</script>
  

  <div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg">
    <form on:submit|preventDefault={handleSubmit} method="GET" action="?/filterasset">
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="price">
            Filter by Category
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="category"
            type="text"
            placeholder="Enter Category"
            
          />
        </div>
        <br>
        <div class="w-full px-3 mb-6 md:mb-0">
          <br>
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="price">
            Filter by Price
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="price"
            type="number"
            placeholder="Enter price"
            
          />
        </div>
        <button type="submit" class="bg-blue-500 hover:bg-gray-700 text-white font-bold mt-5 ml-2 px-2 rounded">
          SEARCH
        </button>
      </div>
    </form>
  </div>

<h1>
  {name}
  {description}
  {price}
  {category}
  <!-- {image}  -->
</h1>
  
  <!-- <Table assets={data.assets} /> -->