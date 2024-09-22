// Modules and libraries
import { redirect } from '@sveltejs/kit';


/**
 * Check is the authStore exists or not.
 * @returns
 */
export const load = async ({ locals }) => {
	if (!locals.pocketbase.authStore.model) {
		throw redirect(302, '/');
	}
};

/**
 * Form action which handles uploading the new avatar.
 * Redirects to errors if failed.
 */
export const actions = {
	updateAvatar: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData());

		if (data.avatar && locals && locals.user) {
			const user = await locals.pocketbase.collection('users').update(locals.user.id, {
				avatar: data.avatar
			});

			throw redirect(307, '');
		}

		throw redirect(302, '/errors');
	}
};
