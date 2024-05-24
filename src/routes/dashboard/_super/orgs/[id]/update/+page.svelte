<script lang="ts">
	/**
	 * This Svelte component represents the update page for an organization in the dashboard.
	 * It imports various dependencies and defines the necessary variables and components.
	 * The component receives `data` and `form` as props.
	 * The `data` prop contains the organization data, while the `form` prop contains the action data.
	 * The component renders a `DashboardPage` component with a title and a content section.
	 * The content section includes an `UpdateOrgForm` component for updating the organization.
	 */
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
