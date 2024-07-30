<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    const email = writable('');
    const password = writable('');
    const name = writable('');
    const errorMessage = writable('');
    const dispatch = createEventDispatcher();
    const isAuthenticated = writable(false);
  
    let updateData = {
      email: '',
      password: '',
      name: ''
    };

    let data;
    let userId;
    let token;

    function checkAuthToken() {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
  }

   async function getUserId(){
    checkAuthToken();

    if (!token) {
      isAuthenticated.set(false);
      window.location.href = '/login';
      // return;
    }
    else {
        isAuthenticated.set(true);
        // return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        data = await response.json();
        console.log(data);
        userId = data.userId;
        // isAuthenticated.set(true);
      } else {
        // isAuthenticated.set(false);
        errorMessage.set('Failed to fetch user details. Please log in again.');
      }
    } catch (error) {
      // isAuthenticated.set(false);
      errorMessage.set('An error occurred. Please try again.');
    }

   }
  
    async function handleSubmit() {

      try {
        const response = await fetch('http://localhost:3000/users/'+ userId, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
  
        const data = await response.json();
        if (response.ok) {
          dispatch('updateSuccess', data);
          window.location.href = '/';
        } else {
          errorMessage.set(data.message);
        }
      } catch (error) {
        errorMessage.set('An error occurred. Please try again.');
      }
    }

    onMount(()=>{
        getUserId();
    })
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Update User Profile</h2>
      {#if $errorMessage}
        <div class="bg-red-200 text-red-800 p-2 rounded mb-4">{$errorMessage}</div>
      {/if}
      <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="name">Name</label>
            <input class="w-full px-3 py-2 border rounded" type="name" id="name" bind:value={updateData.name} required />
          </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input class="w-full px-3 py-2 border rounded" type="email" id="email" bind:value={updateData.email} required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password">Password</label>
          <input class="w-full px-3 py-2 border rounded" type="password" id="password" bind:value={updateData.password} required />
        </div>
        <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Update</button>
      </form>
      <footer class="mt-4">
        <p>Want to delete your account? <a href="/delete-account" class="text-blue-500"> Click here</a></p>
      </footer>
    </div>
  </div>
  