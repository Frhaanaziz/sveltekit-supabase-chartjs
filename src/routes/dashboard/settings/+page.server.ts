import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { updateAvatarSchema, updateUserSchema } from '$lib/validators/user';
import { supabaseAdminClient } from '$lib/server/supabase';

export const load: PageServerLoad = async (event) => {
	const {
		locals: { supabase, getUser }
	} = event;
	const user = await getUser();
	if (!user) {
		console.error('No user found');
		return fail(400, { error: 'No user found' });
	}

	const [orgsRes, profileRes] = await Promise.all([
		supabase.from('orgs').select('id,name'),
		supabase.from('profiles').select().eq('id', user.id).single()
	]);
	if (!orgsRes.data) {
		console.error('No orgs found', orgsRes.error);
		return fail(400, { error: 'No orgs found' });
	}
	if (!profileRes.data) {
		console.error('No profile found', profileRes.error);
		return fail(400, { error: 'No profile found' });
	}

	const orgs = orgsRes.data;
	const profile = profileRes.data;

	const form = await superValidate(
		{
			...profile,
			org_id: profile.org_id ?? undefined
		},
		zod(updateUserSchema)
	);
	const avatarForm = await superValidate(event, zod(updateAvatarSchema));

	return { orgs, profile, form, avatarForm };
};

export const actions: Actions = {
	updateUser: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(updateUserSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { id, email, org_id, role, name } = form.data;

		const { data: org } = await supabase.from('orgs').select().eq('id', org_id).single();
		if (!org) return fail(400, { error: 'Invalid org', form });

		const [updateUserRes, updateProfileRes] = await Promise.all([
			supabaseAdminClient.auth.admin.updateUserById(id, {
				email,
				app_metadata: { name, org, role }
			}),
			supabase.from('profiles').update(form.data).eq('id', id)
		]);
		if (updateUserRes.error) {
			console.error('Failed to update user', updateUserRes.error);
			return fail(400, { error: updateUserRes.error.message, form });
		}
		if (updateProfileRes.error) {
			console.error('Failed to update user profile', updateProfileRes.error);
			return fail(400, { error: updateProfileRes.error.message, form });
		}

		await supabase.auth.refreshSession();

		return { success: 'User updated succesfully', form };
	},
	updateAvatar: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(updateAvatarSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { id, avatar } = form.data;

		const avatarExt = avatar.name.split('.').pop();

		const fileRes = await supabase.storage
			.from('avatars')
			.upload(`${id}/avatar.${avatarExt}`, avatar, {
				upsert: true
			});
		if (fileRes.error) {
			console.error('Failed to upload avatar', fileRes.error);
			return fail(400, { error: 'Failed to upload avatar', form: withFiles(form) });
		}

		const {
			data: { publicUrl }
		} = supabase.storage.from('avatars').getPublicUrl(fileRes.data.path);

		const [updateProfileRes, updateUserRes] = await Promise.all([
			await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', id),
			await supabaseAdminClient.auth.admin.updateUserById(id, {
				app_metadata: { avatar: publicUrl }
			})
		]);
		if (updateProfileRes.error) {
			console.error('Failed to update profile', updateProfileRes.error);
			return fail(400, { error: 'Failed to update profile', form: withFiles(form) });
		}
		if (updateUserRes.error) {
			console.error('Failed to update user', updateUserRes.error);
			return fail(400, { error: 'Failed to update user', form: withFiles(form) });
		}

		await supabase.auth.refreshSession();

		return { success: 'Avatar uploaded successfully', form: withFiles(form) };
	},
	removeAvatar: async ({ request, locals: { supabase } }) => {
		const { id } = Object.fromEntries(await request.formData()) as { id: string };

		const [updateProfileRes, updateUserRes] = await Promise.all([
			supabase.from('profiles').update({ avatar: null }).eq('id', id),
			supabaseAdminClient.auth.admin.updateUserById(id, {
				app_metadata: { avatar: null }
			})
		]);
		if (updateProfileRes.error) {
			console.error('Failed to update profile', updateProfileRes.error);
			return fail(400, { error: 'Failed to update profile' });
		}
		if (updateUserRes.error) {
			console.error('Failed to update user', updateUserRes.error);
			return fail(400, { error: 'Failed to update user' });
		}

		await supabase.auth.refreshSession();

		return { success: 'Avatar removed successfully' };
	}
};
