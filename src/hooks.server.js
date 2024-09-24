/**
 * Modified from: https://github.com/jianyuan/pocketbase-sveltekit-auth/
 */
import PocketBase from 'pocketbase';

//  Type and variables
import { PUBLIC_DATABASE_URL } from '$env/static/public';

export const handle = async ({ event, resolve }) => {
	event.locals.pocketbase = new PocketBase(PUBLIC_DATABASE_URL);
	event.locals.pocketbase.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	// Log detailed request information including IP address, user agent, location, device type, operating system, language, and referrer
	const ip = event.request.headers.get('cf-connecting-ip') || event.request.headers.get('x-forwarded-for') || event.request.headers.get('x-real-ip') || event.clientAddress;
	const userAgent = event.request.headers.get('user-agent');
	const location = event.request.headers.get('cf-ipcountry');
	const device = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
	const operatingSystem = /windows/i.test(userAgent) ? 'Windows' :
	                        /macintosh/i.test(userAgent) ? 'MacOS' :
	                        /linux/i.test(userAgent) ? 'Linux' :
	                        /android/i.test(userAgent) ? 'Android' :
	                        /iphone|ipad/i.test(userAgent) ? 'iOS' : 'Unknown';
	const language = event.request.headers.get('accept-language');
	const referrer = event.request.headers.get('referer') || event.request.headers.get('referrer');
	const contentType = event.request.headers.get('content-type');
	const contentLength = event.request.headers.get('content-length');
	const acceptEncoding = event.request.headers.get('accept-encoding');
	const connection = event.request.headers.get('connection');
	const host = event.request.headers.get('host');

	console.log('Request IP:', ip);
	console.log('User Agent:', userAgent);
	console.log('Location:', location);
	console.log('Device:', device);
	console.log('Operating System:', operatingSystem);
	console.log('Language:', language);
	console.log('Referrer:', referrer);
	console.log('Content Type:', contentType);
	console.log('Content Length:', contentLength);
	console.log('Accept Encoding:', acceptEncoding);
	console.log('Connection:', connection);
	console.log('Host:', host);
	console.log('----------------------------------------');
	try {
		if (event.locals.pocketbase.authStore.isValid) {
			await event.locals.pocketbase.collection('users').authRefresh();
		}
		event.locals.user = structuredClone(event.locals.pocketbase.authStore.model);
	} catch (__error) {
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);
	const expires = new Date();

	// Set expiration time on the cookie
	expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 7);

	response.headers.append(
		'set-cookie',
		event.locals.pocketbase.authStore.exportToCookie({ secure: true, expires, sameSite: 'none' })
	);

	return response;
};
