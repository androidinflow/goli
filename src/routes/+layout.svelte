<script lang="ts">
	import '../app.css';

	// Modules
	import { user } from '$lib/stores/user.store.js'

	import Navbar from '$lib/components/navbar/Navbar.svelte';


	export let data;

	$: $user = data.user
</script>

<div class="bg-base-300">
	<Navbar />
	<slot />
</div>
