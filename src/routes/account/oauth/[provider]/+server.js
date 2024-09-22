import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * GET handler
 *
 * This handles the end of the login or registering with OAuth provider.
 *
 * 1. The provider information stored in the cookie is checked.
 * 2. We use the authWithOAuth2Code function to complete the authorization.
 * 3. We then check if the resulting information exists and update the
 *    user information.
 */
export const GET = async ({ locals, url, cookies }) => {
	const provider = JSON.parse(cookies.get('provider') || '{}');

	if (provider.state !== url.searchParams.get('state')) {
		throw redirect(302, '/errors');
	}

	try {
		const result = await locals.pocketbase
			.collection('users')
			.authWithOAuth2Code(
				provider.name,
				url.searchParams.get('code') || '',
				provider.codeVerifier,
				env.REDIRECT_URL + provider.name
			);

		if (result.meta && result.record) {
			await locals.pocketbase.collection('users').update(result.record.id, {
				avatarUrl: result.meta.avatarUrl,
				name: result.meta.name,
			});
		} else {
			throw error(500, 'Invalid OAuth result');
		}
	} catch (err) {
		throw redirect(302, '/errors');
	}

	throw redirect(302, '/');
};
