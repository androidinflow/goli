<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import Post from '$lib/components/Post.svelte';
    import { fade, fly } from 'svelte/transition';

    export let data;
    const image_url = 'https://pb.redruby.one/api/files/posts/';

    $: ({ bookmarkedPosts } = data);

    function handleToggleBookmark() {
        return ({ result }) => {
            if (result.type === 'success') {
                goto('/account/bookmarks', { invalidateAll: true });
            }
        };
    }
</script>

<div class="w-full max-w-6xl px-4 mx-auto" in:fade={{ duration: 300 }}>
    <h2 class="text-3xl font-bold mb-6 text-primary">Your Bookmarks</h2>
    {#if bookmarkedPosts.length === 0}
        <p class="text-center text-lg text-gray-600">You haven't bookmarked any posts yet.</p>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each bookmarkedPosts as post, index (post.id)}
                <div 
                    class="relative transform transition duration-500 hover:scale-105 hover:rotate-1 shadow-lg rounded-lg overflow-hidden"
                    in:fly={{ y: 50, duration: 300, delay: index * 100 }}
                >
                    <Post
                        title={post.title.substring(0, 25) + '...'}
                        description={post.content.length > 140 ? post.content.substring(0, 140) + '...' : post.content}
                        imageUrl={image_url + post.id + '/' + post.main_image}
                        buttonText="Read More"
                        on:click={() => goto(`/post/${post.id}`)}
                    />
                    <form action="?/toggleBookmark" method="POST" use:enhance={handleToggleBookmark}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button 
                            type="submit" 
                            class="absolute top-2 right-2 text-2xl transition-transform duration-300 hover:scale-110 bg-primary text-white rounded-full p-2"
                            title="Remove from bookmarks"
                        >
                            ❌
                        </button>
                    </form>
                </div>
            {/each}
        </div>
    {/if}
</div>
