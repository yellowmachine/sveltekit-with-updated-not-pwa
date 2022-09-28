import { Magic } from 'magic-sdk';
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

let magic;

export const store = writable({
	loading: false,
	user: null
});

function createMagic() {
  magic = magic || new Magic(import.meta.env.VITE_MAGIC_PUBLIC_KEY);
	return magic;
}

export async function login(email) {
	const magic = createMagic();

	const didToken = await magic.auth.loginWithMagicLink({ email });

	// Validate the did token on the server
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${didToken}`
		}
	});

	if (res.ok) {
		const data = await res.json();
		store.set({
			loading: false,
			user: data.user
		});
	}
}

export async function logout() {
	await fetch('/api/auth/logout');
	store.set({
		loading: false,
		user: null
	});
	goto('/auth');
}
