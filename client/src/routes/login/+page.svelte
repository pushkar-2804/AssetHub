<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const email = writable('');
  const password = writable('');
  const errorMessage = writable('');
  const dispatch = createEventDispatcher();

  let loginData = {
    email: '',
    password: ''
  };

  async function handleSubmit() {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      if (response.ok) {

        localStorage.setItem('token', data.token);
        dispatch('loginSuccess', data);
        window.location.href = '/';
      } else {
        errorMessage.set(data.message);
      }
    } catch (error) {
      errorMessage.set('An error occurred. Please try again.');
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-indigo-900">
  <div class="bg-[#180161] text-[#FB773C] p-8 rounded shadow-md w-full max-w-md">
    <h2 class="text-4xl text-center font-bold mb-4">User Login</h2>
    {#if $errorMessage}
      <div class="bg-red-200 text-red-800 p-2 rounded mb-4">{$errorMessage}</div>
    {/if}
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label class="block text-[#EB3678] mb-2" for="email">Email</label>
        <input class="w-full px-3 py-2 rounded bg-[#4F1787]" type="email" id="email" bind:value={loginData.email} required />
      </div>
      <div class="mb-4">
        <label class="block text-[#EB3678] mb-2" for="password">Password</label>
        <input class="w-full px-3 py-2 rounded bg-[#4F1787]" type="password" id="password" bind:value={loginData.password} required />
      </div>
      <button class="mt-6 mb-6 w-full bg-blue-500 text-white py-2 rounded" type="submit">Login</button>
    </form>
    <footer class="mt-4">
      <p>Don't have an account? <a href="/register" class="text-blue-500">Register here</a></p>
    </footer>
  </div>
</div>
