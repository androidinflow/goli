<script>
	// Components
	import LoggedIn from './LoggedIn.svelte';
	import LoggedOut from './LoggedOut.svelte';
	import ToggleLightDarkMode from './ToggleLightDarkMode.svelte';

	import { user } from "$lib/stores/user.store";
</script>

<div class="navbar">
	<div class="flex-1">
		<a href="/" class="text-3xl font-bold btn btn-ghost hover:text-primary transition-colors duration-300">
			<span class="text-primary">CS2</span> Club
		</a>
		<div class="flex-none">
			<ToggleLightDarkMode></ToggleLightDarkMode>
		</div>
	</div>

	{#if $user}
		{#if $user.avatar}
			<LoggedIn avatar={$user.avatar}></LoggedIn>
		{:else if $user.avatarUrl}
			<LoggedIn avatar={$user.avatarUrl}></LoggedIn>
		{:else}
			<LoggedIn avatar={undefined}></LoggedIn>
		{/if}
	{:else}
		<LoggedOut></LoggedOut>
	{/if}
</div>
