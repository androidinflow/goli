// Run client side only as we need access to the cookie
export const ssr = false;

// Modules
import { pocketbase } from '$lib/db/client';
/**
 * Loads cookie as per pocketbase's requirements for auth
 */
export const load = async () => {
	pocketbase.authStore.loadFromCookie(document.cookie);
	pocketbase.authStore.onChange(() => {
		document.cookie = pocketbase.authStore.exportToCookie({ httpOnly: false });
	}, true);
};
