/**
 * If the user exists we pull the information and assign it to our store.
 */
export const load = async ({ locals }) => {
	if (locals.user) {
		/* console.log(locals.user); */
		
		return {
			user: {
				id: locals.user.id,
				avatar: locals.user.avatar ? locals.user.avatar : undefined,
				avatarUrl: locals.user.avatarUrl ? locals.user.avatarUrl : undefined,
				email: locals.user.email,
				username: locals.user.username,
				tel: locals.user.tel,
				created: locals.user.created,
			}
		};
	}
	return {};
};
