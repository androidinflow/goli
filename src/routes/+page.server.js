import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const filterCs = url.searchParams.get('filterCs') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = 5; // Number of posts per page

    try {
        const filter = filterCs ? 'cs = true' : '';
        const posts = await locals.pocketbase.collection('posts').getList(page, perPage, {
            sort: '-created',
            filter: filter
        });

        let bookmarkedPostIds = [];

        // Only fetch bookmarks if user is logged in
        if (locals.user) {
            // Fetch bookmarks for the current user
            const bookmarks = await locals.pocketbase.collection('bookmarks').getFullList({
                filter: `user = "${locals.user.id}"`,
                expand: 'post'
            });

            bookmarkedPostIds = bookmarks.map(bookmark => bookmark?.expand?.post.id);
        }

        return {
            posts: posts.items,
            totalPages: Math.ceil(posts.totalItems / perPage),
            currentPage: page,
            filterCs,
            bookmarkedPostIds
        };
    } catch (err) {
        console.error('Error fetching posts:', err);
        throw error(500, 'Error fetching posts');
    }
};

export const actions = {
    toggleBookmark: async ({ request, locals }) => {
        const data = await request.formData();
        const postId = data.get('postId');

        if (!locals.user) {
            // Redirect to login page with error message
            throw redirect(303, '/account/login?error=You must be logged in to bookmark posts!');
        }

        try {
            let existingBookmark;
            try {
                existingBookmark = await locals.pocketbase.collection('bookmarks').getFirstListItem(`user="${locals.user.id}" && post="${postId}"`);
            } catch (err) {
                // If the bookmark doesn't exist, this error is expected
                if (err.status !== 404) {
                    throw err;
                }
            }

            if (existingBookmark) {
                await locals.pocketbase.collection('bookmarks').delete(existingBookmark.id);
            } else {
                await locals.pocketbase.collection('bookmarks').create({
                    user: locals.user.id,
                    post: postId
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Error toggling bookmark:', err);
            return fail(500, { message: 'Error toggling bookmark', error: err.message });
        }
    }
};