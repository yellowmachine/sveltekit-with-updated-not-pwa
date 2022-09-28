import { magic } from '$lib/_magic';
import { createSessionCookie } from '$lib/_utils';
import { QUERY_USER_ROLE_BY_EMAIL } from '$lib/role'

export async function POST({request, locals}) {
	try {
		const didToken = magic.utils.parseAuthorizationHeader(request.headers.get('authorization'));
		await magic.token.validate(didToken);
		const metadata = await magic.users.getMetadataByToken(didToken);

		const scopedClient = locals.scopedClient;

		const {role, active} = await scopedClient.queryRequiredSingle(QUERY_USER_ROLE_BY_EMAIL,
			{email: metadata.email}
		)

		if(!active){
			return {
				status: 403,
				body: {
					error: {
						message: 'El usuario no esta activo'
					}
				}
			};
		}

		const user = {...metadata, role}
		
		const cookie = await createSessionCookie(user);

		return {
			status: 200,
			headers: {
				'set-cookie': cookie
			},
			//@ts-ignore
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
