<script lang="ts">
	import DashboardPage from '$components/dashboard/DashboardPage.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';
	import { updateOrganizationSchema } from '$lib/validators/organization';
	import UpdateOrgForm from '$components/forms/UpdateOrgForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	const orgs = data.orgs;
	if (!orgs) throw new Error('Missing data');
	const superForm = superFormApi(data.form, {
		validators: zod(updateOrganizationSchema)
	});

	const pathname = $page.url.pathname;
</script>

<DashboardPage {pathname}>
	<h1 slot="title">Update organization</h1>

	<section slot="content" class="bg-base-100 p-5 rounded">
		<UpdateOrgForm formAction={form} {superForm} />
	</section></DashboardPage
>
