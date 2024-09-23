import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const postId = 'hnakrw3bi5z318o'; // Replace with the actual post ID
    
    try {
        const comments = await locals.pocketbase.collection('comments').getList(1, 50, {
            filter: `post = "${postId}"`,
            sort: '-created',
            expand: 'user,post',
        });

        return {
            comments: comments.items,
            totalComments: comments.totalItems,
            postId: postId
        };
    } catch (err) {
        console.error(`Error fetching comments for post ${postId}:`, err);
        throw error(500, 'Error fetching comments');
    }
};
