<!-- src/Register.svelte -->
<script>
    import { writable } from 'svelte/store';
    import { createEventDispatcher } from 'svelte';
  
    const email = writable('');
    const password = writable('');
    const confirmPassword = writable('');
    const name = writable('');
    const errorMessage = writable('');
    const dispatch = createEventDispatcher();
  
    let registrationData = {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    };
    
  
    async function handleSubmit() {
      if (registrationData.password !== registrationData.confirmPassword) {
        errorMessage.set("Passwords do not match");
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: registrationData.name,
            email: registrationData.email,
            password: registrationData.password
          })
        });
  
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          dispatch('registerSuccess', data);
          window.location.href = '/wallet-connection';
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
    <h2 class="text-4xl text-center font-bold mb-6 ">Create Your Account</h2>
    {#if $errorMessage}
      <div class="bg-red-200 text-red-800 p-2 rounded mb-4">{$errorMessage}</div>
    {/if}
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
          <label class="block text-[#EB3678] mb-2" for="name">Name</label>
          <input class="w-full px-3 py-2 bg-[#4F1787] rounded" type="name" id="name" bind:value={registrationData.name} required />
        </div>
      <div class="mb-4">
        <label class="block text-[#EB3678] mb-2" for="email">Email</label>
        <input class="w-full px-3 py-2 bg-[#4F1787] rounded" type="email" id="email" bind:value={registrationData.email} required />
      </div>
      <div class="mb-4">
        <label class="block text-[#EB3678] mb-2" for="password">Password</label>
        <input class="w-full px-3 py-2 bg-[#4F1787] rounded" type="password" id="password" bind:value={registrationData.password} required />
      </div>
      <div class="mb-4">
        <label class="block text-[#EB3678] mb-2" for="confirmPassword">Confirm Password</label>
        <input class="w-full px-3 py-2 bg-[#4F1787] rounded" type="password" id="confirmPassword" bind:value={registrationData.confirmPassword} required />
      </div>
      <button class="mt-6 mb-6 w-full bg-blue-500 text-white py-2 rounded" type="submit">Register</button>
    </form>
    <footer class="mt-4">
      <p>Already have an account? <a href="/login" class="text-blue-500">Login here</a></p>
    </footer>
  </div>
</div>
