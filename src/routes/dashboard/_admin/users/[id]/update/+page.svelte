<script lang="ts">
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import UpdateUserForm from '$lib/components/forms/UpdateUserForm.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateUserSchema } from '$lib/validators/user';
	import { page } from '$app/stores';

	export let data: PageData;
	export let form: ActionData;

	const orgs = data.orgs;
	const session = data.session;
	if (!orgs || !session) throw new Error('Missing data');
	const superForm = superFormApi(data.form, {
		validators: zod(updateUserSchema)
	});

	const pathname = $page.url.pathname;
</script>

<DashboardPage {pathname}>
	<span slot="title">Update user</span>

	<div slot="content" class="bg-base-100 p-5 rounded">
		<UpdateUserForm formAction={form} {superForm} {orgs} />
	</div>
</DashboardPage>
