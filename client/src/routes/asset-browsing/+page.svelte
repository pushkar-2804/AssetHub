<script lang="ts">
    import Table from "$lib/Table.svelte";
  
    /** @type {import('./$types').PageData} */
    export let data;
    console.log("hello", data.assets);
  
    /** @type {import('./$types').ActionData} */
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

//   let selected;
  let selected = options[0].text


  </script>
  


  
<div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg">
  <form method="POST" action="?/create">
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
        class="bg-yellow-500 hover:bg-blue-700 text-white font-bold mt-5 ml-2 px-2 rounded ">
        SEARCH
      </button>
    </div>
  </form>
</div>


<Table assets={data.assets} />