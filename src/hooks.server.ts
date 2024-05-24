import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { imAdmin, imSuper } from '$lib/utils';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

/**
 * Handles the server-side logic for the event.
 * @param event - The event object.
 * @param resolve - The resolve function.
 * @returns The resolved event object.
 */
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 * @returns The session data.
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.getUser = async () => {
		/**
		 * Retrieves the user data from Supabase.
		 * @returns The user data.
		 */
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return user;
	};

	// PROTECT ROUTES
	const user = await event.locals.getUser();

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!user) {
			// the user is not signed in
			redirect(303, '/');
		}
	}

	if (event.url.pathname.startsWith('/dashboard/_admin')) {
		if (!imAdmin(user)) {
			console.info('You are not ADMIN!');
			redirect(303, '/dashboard');
		}
	}

	if (event.url.pathname.startsWith('/dashboard/_super')) {
		if (!imSuper(user)) {
			console.info('You are not SUPER!');
			redirect(303, '/dashboard');
		}
	}

	const ret = resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 * @param name - The name of the response header.
		 * @returns Whether to filter the response header or not.
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	if (import.meta.env.DEV) {
		// DISCARD LOCALHOST EVENTS
		if (event.url.toString().startsWith('http://localhost')) {
			return ret;
		}
	}

	// DISCARD _app events
	if (event.url.toString().includes('/_app/')) {
		return ret;
	}

	return ret;
};
