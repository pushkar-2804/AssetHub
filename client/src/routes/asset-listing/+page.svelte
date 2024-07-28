<!-- <script lang="ts">
   import { onMount } from 'svelte';
   export let form;

   import { writable } from 'svelte/store';
   import { createEventDispatcher } from 'svelte';
    
      const assetName = writable('');
      const description = writable('');
      const price = writable('');
      const category = writable('');
      const images = writable('');
      const errorMessage = writable('');
      const dispatch = createEventDispatcher();


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
  
    // let selected;
    let selected = options[0].text

let assetData = {
  userId: '1',
  assetName: 'Asset Name',
  description: 'Description of the asset',
  price: '100',
  category: 'GADGET',
  images: [] // This will hold the file input element
};

let imageInput;

async function handleSubmit() {
  const formData = new FormData();
  formData.append('userId', assetData.userId);
  formData.append('assetName', assetData.assetName);
  formData.append('description', assetData.description);
  formData.append('price', assetData.price);
  formData.append('category', assetData.category);

  for (const file of imageInput.files) {
    formData.append('images', file);
  }

  try {
    console.log("hello", formData)

    const response = await fetch('http://localhost:3000/assets/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      // throw new Error(HTTP error! status: ${response.status});
    }

    const result = await response.json();
    console.log('Asset created successfully:', result)
  } catch (error) {
    console.error('Error creating asset:', error);
  }
}


  </script> -->

  
  <script lang="ts">
    import { writable } from 'svelte/store';
    import { createEventDispatcher, onMount } from 'svelte';

  
    export let form;
  
    const assetName = writable('');
    const description = writable('');
    const price = writable('');
    const category = writable('GADGET'); // Default category
    const imageInput = writable(null);
    // const images = writable([]);
    const errorMessage = writable('');
    const dispatch = createEventDispatcher();
  
    let options = [
      { text: 'GADGET' },
      { text: 'DEAL' },
      { text: 'SOFTWARE' },
    ];
  
    // let imageInput;
  
    async function handleSubmit() {
      const formData = new FormData();
      formData.append('userId', '1');
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
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('Asset created successfully:', result);
        // Dispatch a success event or update the UI as needed
        dispatch('success', result);
      } catch (error) {
        console.error('Error creating asset:', error);
        errorMessage.set('Failed to create asset. Please try again.');
      }
    }
  </script>


<div
class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
>
<form method="POST" on:submit|preventDefault={handleSubmit}>
  <div class="flex flex-wrap -mx-3 mb-2">
    <h1>Create New Assets</h1>
    <br>
    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="assetName"
      >
        Asset Name
      </label>
      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="description"
      >
        Enter the description
      </label>
      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="description"
        type="text"
        placeholder="Enter description"
        bind:value={$description}
      />
    </div>

    <div class="w-full px-3 mb-6 md:mb-0">
      <br>
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="price"
      >
        Enter price
      </label>

      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="images"
      >
        Image Upload
      </label>

      <input
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="images"
        type="file"
        placeholder="Upload Image"
        bind:value={$imageInput}
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

  {#if form?.success}
    <p class="pt-2">Asset was created successfully!!!</p> 
  {/if}
</form>
</div>