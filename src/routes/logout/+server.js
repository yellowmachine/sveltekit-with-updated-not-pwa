import { magic } from '$lib/_magic';
import { removeSessionCookie } from '$lib/_utils';

export async function get(event) {
	try {
		if (!event.locals['user']) {
			return {
				status: 401,
				body: {
					error: {
						message: 'Unauthorized'
					}
				}
			};
		}

		const cookie = removeSessionCookie();

		try {
			await magic.users.logoutByIssuer(event.locals.user.issuer);
		} catch (err) {
			console.log('Magic session already expired');
		}

		return {
			status: 200,
			headers: {
				'cache-control': 'no-store',
				'set-cookie': cookie
			},
			body: {}
		};
	} catch (err) {
		return {
			status: 401,
			body: {
				error: {
					message: 'Unauthorized'
				}
			}
		};
	}
}
