<script>
    export let data;
    const { comments, totalComments, postId } = data;
</script>

<h2>Comments for Post {postId} ({totalComments})</h2>

{#each comments as comment}
    <div class="comment">
        <p>{comment.expand.user.email}: {comment.content}</p>
        <small>Posted on: {new Date(comment.created).toLocaleString()}</small>
    </div>
{/each}

<style>
    .comment {
        border: 1px solid #ddd;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
