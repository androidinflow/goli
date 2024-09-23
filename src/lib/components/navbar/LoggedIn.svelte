<script>
	export let avatar;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleLogout() {
		dispatch('logout');
	}
</script>

<div class="dropdown dropdown-end">
	<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
		<div class="w-12 overflow-hidden rounded-full">
			{#if avatar}
				<img
					class="object-cover w-full h-full border-4 rounded-full border-primary"
					alt="Account avatar"
					src={avatar}
				/>
			{:else}
				<div class="flex items-center justify-center w-full h-full rounded-full bg-primary">
					<span class="text-xl text-white">?</span>
				</div>
			{/if}
		</div>
	</div>
	<ul class="menu menu-md dropdown-content mt-3 z-20 p-2 bg-base-100 shadow rounded-box w-52">
		<li>
			<a href="/account/profile" class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
				</svg>
				Profile
			</a>
		</li>
		<li>
			<a href="/account/bookmarks" class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
					<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
				</svg>
				Bookmarks
			</a>
		</li>
		<form action="/account/logout" method="POST">
			<li>
				<button type="submit" class="text-red-500 hover:text-red-700 flex items-center w-full">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
					</svg>
					Logout
				</button>
			</li>
		</form>
	</ul>
</div>
