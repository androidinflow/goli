// Modules and libraries
import { redirect, fail, error } from '@sveltejs/kit';
import { sendTelegramMessage } from '$lib/telegram.js';

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
	},

	updateTelegram: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData());

		if (!locals.user) {
			return fail(401, { message: 'You must be logged in to update your profile' });
		}

		const telegramCode = data.chatId;

		if (!telegramCode) {
			return fail(400, { message: 'Telegram code is required' });
		}

		try {
			// Check if the telegramCode exists in the tele_users collection
			const teleUser = await locals.pocketbase.collection('tele_users').getFirstListItem(`uniqueCode="${telegramCode}"`);

			if (!teleUser) {
				return fail(400, { message: 'Invalid Telegram code' });
			}

			// Update the user with the tele relation
			await locals.pocketbase.collection('users').update(locals.user.id, {
				tel: teleUser.id  // Set the relation field 'tele' with the tele_users record id
			});

			// Send a Telegram message to the user
			const message = 'Your Telegram account has been successfully linked!';
			await sendTelegramMessage(teleUser.chatId, message);

			return { success: true, message: 'Profile updated and Telegram message sent' };
			
		} catch (error) {
			console.error('Error updating Telegram relation or sending message:', error);
			return fail(500, { message: 'Failed to update Telegram relation or send message' });
		}
	}
};
