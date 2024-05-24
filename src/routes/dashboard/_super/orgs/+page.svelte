<script lang="ts">
	/**
	 * This Svelte component represents the page for displaying organizations in a dashboard.
	 * It includes a table with organization data, pagination, and a form for creating new organizations.
	 *
	 * @component DashboardOrgsPage
	 *
	 * @param {PageData} data - The page data containing information about organizations.
	 * @param {ActionData} form - The form data for creating organizations.
	 */
	import { page } from '$app/stores';
	import DashboardPage from '$components/dashboard/DashboardPage.svelte';
	import type { Organization } from '$types';
	import type { ActionData, PageData } from './$types';
	import SvelteTable, { type TableColumns } from 'svelte-table';
	import { PlusIcon } from 'svelte-feather-icons';
	import Pagination from '$components/dashboard/tables/Pagination.svelte';
	import CreateOrgForm from '$components/forms/CreateOrgForm.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createOrganizationSchema } from '$lib/validators/organization';
	import OrgTableAction from '$components/dashboard/tables/OrgTableAction.svelte';
	import RelativeDate from '$components/dashboard/tables/RelativeDate.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: orgsData = data.orgsData;
	$: orgs = orgsData?.content;
	const pathname = $page.url.pathname;
	let isModalOpen = false;

	const superForm = superFormApi(data.form!, {
		validators: zod(createOrganizationSchema)
	});

	const columns = [
		{
			key: 'name',
			title: 'Name',
			value: (v: any) => v.name,
			sortable: true
		},
		{
			key: 'created_by',
			title: 'Created by',
			value: (v: any) => v.created_by.name,
			sortable: true
		},
		{
			key: 'created_at',
			title: 'Created at',
			sortable: true,
			renderComponent: {
				component: RelativeDate,
				props: { column: 'created_at' }
			}
		},
		{
			key: 'delete-action',
			title: 'Actions',
			renderComponent: {
				component: OrgTableAction
			}
		}
	] satisfies TableColumns<Organization>;
</script>

{#if orgsData && orgs && orgs.length > 0}
	<DashboardPage {pathname}>
		<h1 slot="title">Organizations</h1>
		<section slot="content" class="bg-base-100 p-5 rounded">
			<div class="flex items-center mb-5">
				<h2 class="text-lg font-semibold">
					Total organizations <span class="text-primary font-bold">({orgsData.totalRow})</span>
				</h2>

				<div class="tooltip ml-auto" data-tip="Create user">
					<label for="add_org_modal" class="btn btn-outline btn-square btn-sm">
						<PlusIcon class="w-4 h-4" />
					</label>
				</div>
			</div>

			<div class="overflow-x-auto">
				<SvelteTable
					{columns}
					rows={orgs}
					classNameTable={'table divide-y min-w-[600px]'}
					classNameTbody={'divide-y'}
				/>
			</div>

			<div class="w-full mt-7">
				<Pagination {...orgsData} {pathname} />
			</div>
		</section>
	</DashboardPage>
{/if}

<input type="checkbox" id="add_org_modal" class="modal-toggle" bind:checked={isModalOpen} />
<div class="modal" role="dialog" class:modal-open={isModalOpen}>
	<div class="modal-box max-w-lg">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			on:click={() => (isModalOpen = false)}>✕</button
		>

		<CreateOrgForm {superForm} formAction={form} on:closeModal={() => (isModalOpen = false)} />
	</div>
</div>
