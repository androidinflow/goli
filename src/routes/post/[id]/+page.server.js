import { error, fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    try {
        const post = await locals.pocketbase.collection('posts').getOne(params.id);
        
        const comments = await locals.pocketbase.collection('comments').getList(1, 50, {
            filter: `post="${params.id}"`,
            expand: 'user,parent_comment'
        });

        return {
            post,
            commentsData: comments.items
        };
    } catch (e) {
        console.error('Error loading post:', e);
        throw error(404, 'Post not found');
    }
};

export const actions = {
    addComment: async ({ request, locals, params }) => {
        // Check if the user is logged in
        if (!locals.user) {
            return fail(401, { message: 'You must be logged in to add a comment' });
        }

        const formData = await request.formData();
        const content = formData.get('content');

        if (!content) {
            return fail(400, { message: 'Comment content is required' });
        }

        try {
            await locals.pocketbase.collection('comments').create({
                content,
                user: locals.user.id,
                post: params.id
            });
            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    }
};