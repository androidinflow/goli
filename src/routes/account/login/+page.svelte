<script>
	import { page } from '$app/stores';
	import { fly, fade } from 'svelte/transition';


	// Get the error message from the URL, if any
	$: errorMessage = $page.url.searchParams.get('error');


	function animateLogo() {
		logoSpring.set({ scale: 1.1, rotation: 360 });
		setTimeout(() => logoSpring.set({ scale: 1, rotation: 0 }), 500);
	}
</script>

<div class="flex flex-col px-2	 items-center justify-center" in:fly="{{ y: 200, duration: 500 }}">
	<div class="w-full max-w-md p-8 space-y-8 bg-base-100 shadow-xl rounded-2xl" in:fly="{{ y: 50, duration: 400, delay: 100 }}">
		<h1 class="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 animate-pulse" in:fly="{{ y: -20, duration: 300, delay: 200 }}">Intergalactic Gateway</h1>
		
		<form action="?/google" method="POST" class="space-y-6" in:fade="{{ duration: 300, delay: 300 }}">
			<button
				type="submit"
				class="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-black hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 text-purple-300 rounded-full transition duration-500 ease-in-out transform hover:scale-105 shadow-lg border border-purple-600 relative overflow-hidden group"
			>
				<div class="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
				<svg class="w-6 h-6 animate-spin-slow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z" fill="currentColor"/>
				</svg>
				<span class="text-sm font-medium">Initiate Cosmic Sync</span>
			</button>
		</form>


		<div class="mt-6 text-center">
			<p class="text-sm text-gray-400">🌌 Hyperdimensional encryption active 🚀</p>
		</div>

		<div class="mt-8 flex justify-center space-x-4">
			{#each ['🪐', '👽', '🛸', '🌠'] as emoji}
				<span class="text-2xl animate-float">{emoji}</span>
			{/each}
		</div>

	</div>

	{#if errorMessage}
		<div class="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700" role="alert" in:fly="{{ x: 50, duration: 300, delay: 500 }}">
			<p class="font-bold">Error</p>
			<p>{errorMessage}</p>
		</div>
	{/if}
</div>
