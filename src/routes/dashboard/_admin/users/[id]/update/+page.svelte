<script lang="ts">
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
