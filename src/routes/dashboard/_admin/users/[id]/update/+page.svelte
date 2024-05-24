<script lang="ts">
	/**
	 * This Svelte component represents the update user page in the dashboard.
	 * It allows the user to update user information and avatar.
	 *
	 * @component UpdateUserPage
	 *
	 * @param {Object} data - The page data containing the user profile and form data.
	 * @param {Object} form - The action data for the form.
	 *
	 * @fires toast.success - Fires a success toast message when the user is updated successfully.
	 * @fires toast.error - Fires an error toast message when there is an error updating the user.
	 * @fires invalidateAll - Invalidates all cached data to trigger a refresh.
	 *
	 * @slot title - The title of the page.
	 * @slot content - The content of the page.
	 */
	import DashboardPage from '$components/dashboard/DashboardPage.svelte';
	import UpdateUserForm from '$components/forms/UpdateUserForm.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateAvatarSchema, updateUserSchema } from '$lib/validators/user';
	import { page } from '$app/stores';
	import UpdateAvatarForm from '$components/forms/UpdateAvatarForm.svelte';
	import toast from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;
	$: profile = data.profile;

	const orgs = data.orgs;
	if (!orgs) throw new Error('Missing data');
	const superForm = superFormApi(data.form, {
		validators: zod(updateUserSchema)
	});
	const avatarSuperForm = superFormApi(data.avatarForm, {
		validators: zod(updateAvatarSchema)
	});

	const pathname = $page.url.pathname;

	$: {
		if (form?.error) toast.error(form.error);
		if (form?.success) {
			toast.success('User updated successfully');
			invalidateAll();
		}
	}
</script>

<DashboardPage {pathname}>
	<h1 slot="title">Update user</h1>

	<section slot="content" class="bg-base-100 p-5 rounded">
		{#if profile}
			<UpdateAvatarForm superForm={avatarSuperForm} {profile} />
		{/if}

		<UpdateUserForm {superForm} {orgs} />
	</section>
</DashboardPage>
