<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  
	const dispatch = createEventDispatcher();
  
	const handleClose = () => {
	  dispatch('close');
	};
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="bg-white p-6 rounded-lg shadow-lg relative">
	  <slot></slot>
	  <button on:click={handleClose} class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
	</div>
  </div>


<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}

	.button1 {
  background-color: white; 
  color: #0003c3cb; 
  border: 2px solid #6366f1;
}

.button1:hover {
  background-color: #6366f1;
  color: white;
}
</style>
  
  <!-- <style>
	.fixed {
	  position: fixed;
	}
	.inset-0 {
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;
	}
	.flex {
	  display: flex;
	}
	.items-center {
	  align-items: center;
	}
	.justify-center {
	  justify-content: center;
	}
	.bg-black {
	  background-color: black;
	}
	.bg-opacity-50 {
	  background-opacity: 0.5;
	}
	.bg-white {
	  background-color: white;
	}
	.p-6 {
	  padding: 1.5rem;
	}
	.rounded-lg {
	  border-radius: 0.5rem;
	}
	.shadow-lg {
	  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
	.relative {
	  position: relative;
	}
	.absolute {
	  position: absolute;
	}
	.top-2 {
	  top: 0.5rem;
	}
	.right-2 {
	  right: 0.5rem;
	}
	.text-gray-500 {
	  color: #6b7280;
	}
	.hover\:text-gray-700:hover {
	  color: #374151;
	}
  </style> -->
  