<script>
	export let avatar;
</script>

<div class="w-16 h-16 overflow-hidden border-4 rounded-full border-primary">
	{#if avatar}
		<img class="object-cover w-full h-full rounded-full" alt={avatar} src={avatar} />
	{:else}
		<div class="flex items-center justify-center w-full h-full rounded-full bg-info"></div>
	{/if}
</div>
