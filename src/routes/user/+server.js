import { createSessionCookie } from '$lib/_utils';

export async function get({locals}) {
	try {
		if (!locals.user) {
			return {
				status: 200,
				body: {
					user: null
				}
			};
		}

		const user = locals.user;
		const cookie = await createSessionCookie(user);

		return {
			status: 200,
			headers: {
				'cache-control': 'no-store',
				'set-cookie': cookie
			},
			body: {
				user
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				error: {
					message: 'Internal Server Error'
				}
			}
		};
	}
}
