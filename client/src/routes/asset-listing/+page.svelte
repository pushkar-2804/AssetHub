<script lang="ts">

    export let form;


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

  // let selected;
  let selected = options[0].text


    </script>

    
    
    <div
      class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
    >
      <form method="POST" action="?/create">
        <div class="flex flex-wrap -mx-3 mb-2">
          <h1>Create New Assets</h1>
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
            />
          </div>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
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
            />
          </div>
          <br>
          <div class="w-full px-3 mb-6 md:mb-0">
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
            />
          </div>
          <br>
        
        <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="category"
            >
              Category
            </label>
            <br>
        
        <!-- <form id="category" name="category"> -->
            <select id="category" name="category" bind:value={selected}
                >
                {#each options as option}
                    <option value={option.text}>
                        {option.text}
                    </option>
                {/each}
            </select>
        <!-- </form> -->
        
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
    