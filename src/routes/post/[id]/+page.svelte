<script>
    import { Motion, useMotionTemplate, useMotionValue } from "svelte-motion";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';
    import Comment from '$lib/components/Comment.svelte';  // Import the new Comment component
    
    export let data;
    const { post, commentsData, user } = data;

    let loading = true;  // Add loading state
    let error = null;    // Add error state

    // Function to build a tree from flat comments array
    function buildCommentTree(comments) {
        const commentMap = {};
        const tree = [];
        
        // Initialize the map
        comments.forEach((comment) => {
            comment.children = [];
            commentMap[comment.id] = comment;
        });
        // Build the tree
        comments.forEach((comment) => {
            if (comment.parent_comment) {
                const parent = commentMap[comment.parent_comment];
                if (parent) {
                    parent.children.push(comment);
                } else {
                    // If parent not found, treat as root
                    tree.push(comment);
                }
            } else {
                tree.push(comment);
            }
        });

        return tree;
    }

    // Prepare the comment tree
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
                // Reset the form
                replyingTo = null;
                
                // Invalidate all data and update the page
                await invalidateAll();
                await update();
            }
        };
    }

    onMount(() => {
        // Simulate fetching comments
        setTimeout(() => {
            loading = false;
        }, 2000);
    });
</script>

<div class="flex justify-center bg-base-200 p-4 container ">
    <div
        on:mousemove={handleMouseMove}
        class="group relative w-full overflow-hidden rounded-xl bg-base-300 border border-base-content/10 px-4 py-5  max-w-6xl"
        role="region"
        aria-label="Post content"
    >
        <Motion style={{ background }} let:motion>
            <div
                use:motion
                class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            ></div>
        </Motion>
        <img
            src={`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${post.main_image}`}
            alt={post.title}
            class="rounded-xl max-h-96 w-full object-cover  max-w-6xl"
        />
        <h1 class="text-xl font-semibold text-base-content mt-2">
            {post.title}
        </h1>
        <p class="text-sm opacity-60">
            Posted on {new Date(post.created).toLocaleDateString()}
        </p>
        <div class="divider"></div>
        <div class="prose max-w-none text-sm leading-[1.5] text-base-content/70">
            {@html post.content}
        </div>

        {#if post.other_images?.length}
            <div class="divider"></div>
            <h2 class="text-lg font-semibold mb-2">Other Images</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each post.other_images as image, index}
                    <div class="relative">
                        <img
                            src={`https://pb.redruby.one/api/files/${post.collectionId}/${post.id}/${image}`}
                            alt={`Other image ${index + 1}`}
                            class="w-full rounded-xl"
                        />
                        <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1} / {post.other_images.length}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<main class="max-w-6xl mx-auto px-4 py-8 font-sans ">
    <h1 class="text-2xl font-bold text-left mb-2">Comments</h1>
    
    {#if user}
        <form action="?/addComment" method="POST" use:enhance={handleCommentSubmit} class="mb-4">
            <textarea name="content" class="w-full p-2 border rounded" placeholder={replyingTo ? "Write a reply..." : "Add a comment..."} required></textarea>
            {#if replyingTo}
                <input type="hidden" name="parent_comment" value={replyingTo}>
                <button type="button" on:click={cancelReply} class="bg-gray-500 text-white px-4 py-2 rounded mt-2 mr-2">Cancel Reply</button>
            {/if}
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">{replyingTo ? "Submit Reply" : "Submit Comment"}</button>
        </form>
    {:else}
        <p class="text-center text-gray-500">You must be logged in to add a comment.</p>
    {/if}

    {#if loading}
        <p class="text-center text-gray-500">Loading comments...</p>
    {:else if error}
        <p class="text-center text-red-500">Failed to load comments. Please try again later.</p>
    {:else if commentTree.length > 0}
        {#each commentTree as comment}
            <Comment {comment} on:reply={handleReply} />
        {/each}
    {:else}
        <p class="text-center text-gray-500">No comments available.</p>
    {/if}
</main>
