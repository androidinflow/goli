<script>
    import { Motion, useMotionTemplate, useMotionValue } from "svelte-motion";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';
    import Comment from '$lib/components/Comment.svelte';
    import { fade, scale, fly } from 'svelte/transition';
    import { spring } from 'svelte/motion';
    import Time from "svelte-time/Time.svelte";
    
    export let data;
    const { post, commentsData, user } = data;

    let loading = true;
    let error = null;

    function buildCommentTree(comments) {
        const commentMap = {};
        const tree = [];
        
        comments.forEach((comment) => {
            comment.children = [];
            commentMap[comment.id] = comment;
        });
        comments.forEach((comment) => {
            if (comment.parent_comment) {
                const parent = commentMap[comment.parent_comment];
                if (parent) {
                    parent.children.push(comment);
                } else {
                    tree.push(comment);
                }
            } else {
                tree.push(comment);
            }
        });

        return tree;
    }

    $: commentTree = buildCommentTree(commentsData);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);
    let background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(51, 51, 51, 0.4), transparent 80%)`;

    function handleMouseMove(e) {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    }

    let replyingTo = null;

    function handleReply(event) {
        const commentId = event.detail.commentId;
        replyingTo = commentId;
        console.log('Replying to comment ID:', commentId);
    }

    function cancelReply() {
        replyingTo = null;
    }

    function handleCommentSubmit() {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                replyingTo = null;
                await invalidateAll();
                await update();
            }
        };
    }

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 1000);
    });

    // New code for fullscreen image functionality
    let fullscreenImage = null;
    const fullscreenSpring = spring({ x: 0, y: 0, scale: 0.9 });

    function openFullscreen(image) {
        fullscreenImage = image;
        fullscreenSpring.set({ x: 0, y: 0, scale: 0.9 });
    }

    function closeFullscreen() {
        fullscreenSpring.set({ x: 0, y: 0, scale: 0.5 }, { hard: false }).then(() => {
            fullscreenImage = null;
        });
    }

    // New function for sharing on social media
    function shareOnSocialMedia(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        const imageUrl = encodeURIComponent(`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${post.main_image}`);
        const content = encodeURIComponent(post.content.replace(/<[^>]*>/g, '').slice(0, 200) + '...');
        let shareUrl;

        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=blogpost`;
                window.open(shareUrl, '_blank');
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${title}%0A%0A${content}%0A%0A${imageUrl}`;
                window.open(shareUrl, '_blank');
                break;
        }
    }
</script>

<div class="flex justify-center items-center container mx-auto b" in:fly="{{ y: 50, duration: 300 }}">
    <div
        on:mousemove={handleMouseMove}
        class="group relative overflow-hidden rounded-xl bg-base-300 border border-base-content/10 px-4 py-5   max-w-6xl"
        role="region"
        aria-label="Post content"
        in:scale="{{ duration: 300, delay: 150 }}"
    >
        <Motion style={{ background }} let:motion>
            <div
                use:motion
                class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-200 group-hover:opacity-100"
            ></div>
        </Motion>
        <div
            role="button"
            tabindex="0"
            on:click={() => openFullscreen(post.main_image)}
            on:keydown={(e) => e.key === 'Enter' && openFullscreen(post.main_image)}
        >
        <p class="text-sm opacity-60 my-2 mx-1 flex items-center" in:fly="{{ y: 20, duration: 300, delay: 450 }}">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            <span>Posted </span>
            &nbsp;
            <Time relative timestamp={post.created} />
        </p>
            <img
                src={`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${post.main_image}`}
                alt={post.title}
                class="rounded-xl max-h-96 w-full object-cover max-w-6xl cursor-pointer"
                in:fade="{{ duration: 300, delay: 300 }}"
            />
        </div>
        <h1 class="text-xl font-semibold text-base-content mt-2" in:fly="{{ y: 20, duration: 300, delay: 400 }}">
            {post.title}
        </h1>
        <div class="divider" in:scale="{{ duration: 300, delay: 500 }}"></div>
        <div class="prose max-w-none text-sm leading-[1.5] text-base-content/70" in:fly="{{ y: 20, duration: 300, delay: 550 }}">
            {@html post.content}
        </div>

        <!-- New social media sharing buttons -->
        <div class="mt-4 flex justify-end space-x-2">
            <button on:click={() => shareOnSocialMedia('twitter')} class="btn btn-sm btn-outline">
                Share on Twitter
            </button>
            <button on:click={() => shareOnSocialMedia('telegram')} class="btn btn-sm btn-outline">
                Share on Telegram
            </button>
        </div>

        {#if post.other_images?.length}
            <div class="divider" in:scale="{{ duration: 300, delay: 600 }}"></div>
            <h2 class="text-lg font-semibold mb-2" in:fly="{{ y: 20, duration: 300, delay: 650 }}">Other Images</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each post.other_images as image, index}
                    <button
                        type="button"
                        class="w-full p-0 border-0 bg-transparent"
                        on:click={() => openFullscreen(image)}
                        on:keydown={(e) => e.key === 'Enter' && openFullscreen(image)}
                        in:scale="{{ duration: 300, delay: 700 + index * 50 }}"
                    >
                        <img
                            src={`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${image}`}
                            alt={`Other image ${index + 1}`}
                            class="w-full rounded-xl cursor-pointer"
                        />
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

{#if fullscreenImage}
    <div
        class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        on:click={closeFullscreen}
        on:keydown={(e) => e.key === 'Escape' && closeFullscreen()}
        tabindex="0"
        role="button"
        aria-label="Close fullscreen image"
        transition:fade="{{ duration: 200 }}"
    >
        <Motion let:motion values={fullscreenSpring}>
            <img
                use:motion
                src={`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${fullscreenImage}`}
                alt="Fullscreen"
                class="w-[80%] h-[80%] object-contain"
            />
        </Motion>
    </div>
{/if}

<main class="max-w-6xl mx-auto px-4 py-8 font-sans" in:fly="{{ y: 50, duration: 300, delay: 750 }}">
    <h1 class="text-2xl font-bold text-left mb-2" in:fly="{{ y: 20, duration: 300, delay: 800 }}">Comments</h1>
    
    {#if user}
        <form action="?/addComment" method="POST" use:enhance={handleCommentSubmit} class="mb-4" in:scale="{{ duration: 300, delay: 850 }}">
            <textarea name="content" class="w-full p-2 border rounded" placeholder={replyingTo ? "Write a reply..." : "Add a comment..."} required></textarea>
            {#if replyingTo}
                <input type="hidden" name="parent_comment" value={replyingTo}>
                <button type="button" on:click={cancelReply} class="bg-gray-500 text-white px-4 py-2 rounded mt-2 mr-2">Cancel Reply</button>
            {/if}
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">{replyingTo ? "Submit Reply" : "Submit Comment"}</button>
        </form>
    {:else}
        <p class="text-center text-gray-500" in:fly="{{ y: 20, duration: 300, delay: 850 }}">You must be logged in to add a comment.</p>
    {/if}

    {#if loading}
        <p class="text-center text-gray-500" in:fade="{{ duration: 300, delay: 900 }}">Loading comments...</p>
    {:else if error}
        <p class="text-center text-red-500" in:fade="{{ duration: 300, delay: 900 }}">Failed to load comments. Please try again later.</p>
    {:else if commentTree.length > 0}
        {#each commentTree as comment, index}
            <div in:fly="{{ y: 20, duration: 300, delay: 900 + index * 50 }}">
                <Comment {comment} on:reply={handleReply} />
            </div>
        {/each}
    {:else}
        <p class="text-center text-gray-500" in:fade="{{ duration: 300, delay: 900 }}">No comments available.</p>
    {/if}
</main>
