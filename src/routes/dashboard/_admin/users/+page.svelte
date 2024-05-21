<script lang="ts">
	import { page } from '$app/stores';
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import UsersTable from '$lib/components/dashboard/UsersTable.svelte';
	import type { ActionData, PageData } from './$types';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import CreateUserForm from '$lib/components/forms/CreateUserForm.svelte';
	import { createUserSchema } from '$lib/validators/user';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data: PageData;
	export let form: ActionData;

	const orgs = data.orgs;
	const profilesData = data.profilesData;
	const session = data.session;
	if (!orgs || !profilesData || !session) throw new Error('Missing data');
	const superForm = superFormApi(data.form, {
		validators: zod(createUserSchema)
	});

	const pathname = $page.url.pathname;
	let isModalOpen = false;
</script>

<DashboardPage {pathname}>
	<span slot="title">Users</span>

	<div slot="content" class="bg-base-100 p-5 rounded">
		<UsersTable {profilesData} {pathname} />
	</div>
</DashboardPage>

<input type="checkbox" id="add_user_modal" class="modal-toggle" bind:checked={isModalOpen} />
<div class="modal" role="dialog" class:modal-open={isModalOpen}>
	<div class="modal-box max-w-2xl">
		<form method="add_user_modal">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

		<CreateUserForm
			{superForm}
			{orgs}
			{session}
			formAction={form}
			on:closeModal={() => (isModalOpen = false)}
		/>
	</div>
</div>
