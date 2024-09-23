<script>
	// Modules
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Post from '$lib/components/Post.svelte';

	export let data;
	const image_url = 'https://pb.redruby.one/api/files/posts/';


	$: filterCs = $page.url.searchParams.get('filterCs') === 'true';
	$: currentPage = parseInt($page.url.searchParams.get('page') || '1', 10);

	function toggleFilter() {
		goto(`?filterCs=${!filterCs}&page=1`, { replaceState: true });
	}

	function changePage(newPage) {
		goto(`?filterCs=${filterCs}&page=${newPage}`, { replaceState: true });
	}

	$: ({ posts, totalPages } = data);


	function generatePagination(currentPage, totalPages) {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];
		let l;

		range.push(1);

		for (let i = currentPage - delta; i <= currentPage + delta; i++) {
			if (i < totalPages && i > 1) {
				range.push(i);
			}
		}

		range.push(totalPages);

		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	}
</script>

<div class="relative min-h-screen flex flex-col items-center justify-center">
	<div class="w-full max-w-6xl px-4">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-3xl font-bold">Latest Posts</h2>
			<div class="tabs tabs-boxed">
				<button class="tab {!filterCs ? 'tab-active' : ''}" on:click={toggleFilter}
					>All Posts</button
				>
				<button class="tab {filterCs ? 'tab-active' : ''}" on:click={toggleFilter}>CS only</button>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each posts as post}
				<Post
					title={post.title}
					description={post.content.substring(0, 100) + '...'}
					imageUrl={image_url + post.id + '/' + post.main_image}
					buttonText="Read More"
					on:click={() => goto(`/post/${post.id}`)}
				/>
			{/each}
		</div>
	</div>

	<!-- Pagination controls -->
	<div class="flex justify-center mt-5 z-50">
		<div class="flex flex-wrap gap-2">
			<button
				class="btn btn-xs"
				disabled={currentPage === 1}
				on:click={() => changePage(currentPage - 1)}
			>
				&lt;
			</button>

			{#each generatePagination(currentPage, totalPages) as item}
				{#if item === '...'}
					<span class="btn btn-xs btn-disabled">...</span>
				{:else}
					<button
						class="btn btn-sm {currentPage === item ? 'btn-active' : ''}"
						on:click={() => changePage(Number(item))}
					>
						{item}
					</button>
				{/if}
			{/each}

			<button
				class="btn btn-xs"
				disabled={currentPage === totalPages}
				on:click={() => changePage(currentPage + 1)}
			>
				&gt;
			</button>
		</div>
	</div>
</div>
