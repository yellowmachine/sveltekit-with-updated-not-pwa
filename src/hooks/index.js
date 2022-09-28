import cookie from 'cookie';
import { SESSION_NAME } from '$lib/config';
import { getSession } from './routes/api/auth/_utils';
import { client } from '$lib/edgedb';

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	const user = await getSession(cookies[SESSION_NAME]);

	if(user){
		event.locals.user = user;
		const scopedClient = client.withGlobals({
			current_user: user.email,
		  });
		event.locals.scopedClient = scopedClient;
	}

	// TODO https://github.com/sveltejs/kit/issues/1046
	// if (request.query.has('_method')) {
	// 	request.method = request.query.get('_method').toUpperCase();
	// }

	const response = await resolve(event);

	return response;
};
