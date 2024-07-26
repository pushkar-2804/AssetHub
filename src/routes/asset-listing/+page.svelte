<script lang="ts">

    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    export let form;

    
    const name = writable('');
    const description = writable('');
    const price = writable('');
    const category = writable('');
    const image = writable('');
    const errorMessage = writable('');
    const dispatch = createEventDispatcher();

    let AssetData = {
      name: '',
      description: '',
      price: '',
      category: '',
      image: ''
    };

    // name.subscribe(value => AssetData.name = value);
    // description.subscribe(value => AssetData.description = value);
    // price.subscribe(value => AssetData.price = value);
    // category.subscribe(value => AssetData.category = value);
    // image.subscribe(value => AssetData.image = value);


    async function handleSubmit() {
      try {
        const response = await fetch('http://localhost:3000/asset/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(AssetData)
        });
  
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          dispatch('AssetCreateSuccess', data);
        } else {
          errorMessage.set(data.message);
        }
      } catch (error) {
        errorMessage.set('An error occurred. Please try again.');
      }
    }

    </script>

    
    
    <div
      class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
    >
      <form on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-wrap -mx-3 mb-2">
          <h1>Create New Assets</h1>
          <br>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="name"
            >
              Asset Name
            </label>
            <br>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="name"
              type="text"
              placeholder="Enter asset name "
              name="name"
              bind:value={$name}
            />
          </div>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
            <br>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="description"
            >
              Enter the description
            </label>
            <br>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              type="text"
              placeholder="Enter description"
              name="description"
              bind:value={$description}
            />
          </div>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
            <br>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="price"
            >
              Enter price
            </label>
            <br>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="price"
              type="number"
              placeholder="Enter price"
              name="price"
              bind:value={$price}
            />
          </div>
          <br>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
            <br>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="category"
            >
              Enter the category
            </label>
            <br>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="category"
              type="text"
              placeholder="Enter category"
              name="category"
              bind:value={$category}
            />
          </div>
          <br>

          <div class="w-full px-3 mb-6 md:mb-0">
            <br>
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="square"
            >
              Image Upload
            </label>
            <br>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="image"
              type="text"
              placeholder="Upload Image"
              name="image"
              bind:value={$image}
            />
          </div>   
          <br> 
          <button
            type="submit"
            class="bg-blue-500 hover:bg-gray-700 text-white font-bold mt-5 ml-2 px-2 rounded "
          >
            Create Asset
          </button>
        </div>
      </form>
      {#if form?.success}
        <!-- this message is ephemeral; it exists because the page was rendered in
               response to a form submission. it will vanish if the user reloads -->
        <p class="pt-2">Asset was created successfully!!!</p>
      {/if}
    </div>
    