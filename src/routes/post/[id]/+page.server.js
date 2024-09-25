import { error, fail } from '@sveltejs/kit';
import { sendTelegramMessage } from '$lib/telegram.js';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const load = async ({ params, locals }) => {
    try {
        const post = await locals.pocketbase.collection('posts').getOne(params.id);
        
        const comments = await locals.pocketbase.collection('comments').getList(1, 50, {
            filter: `post="${params.id}"`,
            expand: 'user,parent_comment',
            sort: '-created' 
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
        if (!locals.user) {
            return fail(401, { message: 'You must be logged in to add a comment' });
        }

        const formData = await request.formData();
        const content = formData.get('content');
        const parentComment = formData.get('parent_comment');

        if (!content) {
            return fail(400, { message: 'Comment content is required' });
        }

        try {
            const commentData = {
                content,
                user: locals.user.id,
                post: params.id
            };

            if (parentComment) {
                commentData.parent_comment = parentComment;
            }

            await locals.pocketbase.collection('comments').create(commentData);
            return { success: true };
        } catch (err) {
            console.error('Error adding comment:', err);
            return fail(500, { message: 'Failed to add comment' });
        }
    },

    sendToTelegram: async ({ locals, params }) => {
        if (!locals.user || !locals.user.tel) {
            
            return fail(401, { message: 'You must be logged in and have a Telegram account linked to send posts' });
        }

        try {
            const post = await locals.pocketbase.collection('posts').getOne(params.id);
            
            const message = `
New post: ${post.title}

${post.content.substring(0, 200)}...

Read more: ${PUBLIC_SITE_URL}/post/${post.id}
            `.trim();

            await sendTelegramMessage(locals.user.tel.chatId, message);
            
            return { success: true, message: 'Post sent to Telegram' };
        } catch (err) {
            console.error('Error sending post to Telegram:', err);
            return fail(500, { message: 'Failed to send post to Telegram' });
        }
    }
};