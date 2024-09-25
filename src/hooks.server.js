import PocketBase from 'pocketbase';
import { PUBLIC_DATABASE_URL } from '$env/static/public';
import { logRequest } from '$lib/logRequest';

const COOKIE_EXPIRATION_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function createPocketBaseInstance() {
    return new PocketBase(PUBLIC_DATABASE_URL);
}

function loadAuthFromCookie(pocketbase, cookie) {
    pocketbase.authStore.loadFromCookie(cookie || '');
}

async function refreshAuth(pocketbase) {
    if (pocketbase.authStore.isValid) {
        // Update this line to expand the 'tel' field
        await pocketbase.collection('users').authRefresh({
            expand: 'tel'
        });
    }
}

function getExpirationDate() {
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_EXPIRATION_DAYS * MS_PER_DAY);
    return expires;
}

export const handle = async ({ event, resolve }) => {
    const pocketbase = createPocketBaseInstance();
    event.locals.pocketbase = pocketbase;

    loadAuthFromCookie(pocketbase, event.request.headers.get('cookie'));

    await logRequest(event, pocketbase);

    try {
        await refreshAuth(pocketbase);
        // Make sure to use structuredClone to avoid mutating the original object
        event.locals.user = structuredClone(pocketbase.authStore.model);
        
        // Only try to access expand.tel if user exists
        if (event.locals.user && event.locals.user.expand?.tel) {
            event.locals.user.tel = event.locals.user.expand.tel;
        }
    } catch (error) {
        // Instead of logging an error, just set user to null
        event.locals.user = null;
    }

    const response = await resolve(event);
    const expires = getExpirationDate();

    response.headers.append(
        'set-cookie',
        pocketbase.authStore.exportToCookie({ secure: true, expires, sameSite: 'Lax' })
    );

    return response;
};
