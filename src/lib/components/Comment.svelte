<script>
    import { createEventDispatcher } from 'svelte';

    export let comment;
    
    const dispatch = createEventDispatcher();

    function handleReply() {
        dispatch('reply', {
            commentId: comment.id
        });
    }
</script>
  
  <div class="border p-4 mt-2 border-l-1 border-l-black">
    <div class="flex items-center">
      <img
        src={comment.expand.user.avatarUrl || "/default-avatar.png"}
        alt={comment.expand.user.name}
        class="w-10 h-10 rounded-full mr-3 object-cover"
      />
      <div>
        <strong class="font-semibold">{comment.expand.user.name}</strong>
        {#if comment.expand.user.verified}
          <span class="text-blue-500 ml-1">✔️</span>
        {/if}
        <p class="text-gray-600 text-sm">@{comment.expand.user.username}</p>
      </div>
    </div>
    <div class="mt-2">
      <p class="text-gray-800">{comment.content}</p>
      <span class="text-gray-500 text-xs">{new Date(comment.created).toLocaleString()}</span>
    </div>
    <button on:click={handleReply} class="text-blue-500 text-sm mt-2">Reply</button>
    {#if comment.children && comment.children.length > 0}
      <div class="ml-4 mt-4">
        {#each comment.children as childComment}
          <svelte:self comment={childComment} on:reply />
        {/each}
      </div>
    {/if}
  </div>