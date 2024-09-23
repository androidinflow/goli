import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, 'account/login');
    }

    try {
        const bookmarks = await locals.pocketbase.collection('bookmarks').getFullList({
            filter: `user = "${locals.user.id}"`,
            expand: 'post',
            sort: '-created'
        });

        // Change this line
        const bookmarkedPosts = bookmarks.map(bookmark => bookmark?.expand?.post);

        return {
            bookmarkedPosts
        };
    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        throw error(500, 'Error fetching bookmarks');
    }
};

// Add this new action
export const actions = {
    toggleBookmark: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const data = await request.formData();
        const postId = data.get('postId');

        try {
            const existingBookmark = await locals.pocketbase.collection('bookmarks').getFirstListItem(`user="${locals.user.id}" && post="${postId}"`);

            if (existingBookmark) {
                // If bookmark exists, delete it (unbookmark)
                await locals.pocketbase.collection('bookmarks').delete(existingBookmark.id);
            } else {
                // If bookmark doesn't exist, create it
                await locals.pocketbase.collection('bookmarks').create({
                    user: locals.user.id,
                    post: postId
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error toggling bookmark:', err);
            throw error(500, 'Error toggling bookmark');
        }
    }
};
