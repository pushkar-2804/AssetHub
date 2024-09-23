<script>
  import { createEventDispatcher } from 'svelte';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

const errorMessage = writable('');
const dispatch = createEventDispatcher();
const isAuthenticated = writable(false);

const confirmationKeyword = "delete my account";

let data;
let userId;
let token;
let confirmationCheck;

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

  if (confirmationCheck !== confirmationKeyword) {
  errorMessage.set("Texts does not match, Type again!");
  return;
}



try {
  const response = await fetch('http://localhost:3000/users/'+ userId, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' }
  });

  const data = await response.json();
  if (response.ok) {
    dispatch('deleteSuccess', data);
    localStorage.removeItem('token');
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
<h2 class="text-2xl font-bold mb-4">Delete User Account</h2>
<h2 class="text-gray-700 mb-2">Type the string below to delete your account</h2>
{#if $errorMessage}
  <div class="bg-red-200 text-red-800 p-2 rounded mb-4">{$errorMessage}</div>
{/if}
<form on:submit|preventDefault={handleSubmit}>
  <div class="mt-4 mb-6 py-4 text-center">
    <label class="block font-serif text-xl text-black mb-2" for="confirm">{confirmationKeyword}</label>
    <input class="w-full px-3 py-2 border rounded" type="confirm" id="confirm" bind:value={confirmationCheck} required />
  </div>
  <button class="w-full bg-blue-500 text-white py-2 rounded" type="submit">Delete my Account</button>
</form>
<footer class="mt-4 text-center">
  <p>Go back to <a href="/" class="text-blue-500">Home page</a></p>
</footer>
</div>
</div>
