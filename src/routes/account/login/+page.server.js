// Modules
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
/**
 * Checks if the authStore is valid
 * @returns
 */
export const load = async ({ locals }) => {
	if (locals.pocketbase.authStore.isValid) {
		throw redirect(302, '/');
	}
	return {};
};

export const actions = {
	/**
	 * Google OAuth2
	 *
	 * We get the provider from list of possible providers (set in Pocketbase) by
	 * name and then set the cookie. If valid, we concat Google's auth url with
	 * the redirect set in Google console as well as our provider name see
	 * /account/oauth/google route.
	 *
	 * @param param0
	 */
	google: async ({ locals, cookies }) => {
		const provider = (
			await locals.pocketbase.collection('users').listAuthMethods()
		).authProviders.find((p) => p.name === 'google');

		cookies.set('provider', JSON.stringify(provider), {
			httpOnly: true,
			path: `/`
		});

		if (provider) {
			// Redirects the user to Google's login
			throw redirect(302, provider.authUrl + env.REDIRECT_URL + provider.name);
		}

		throw redirect(302, '/errors');
	}
};
