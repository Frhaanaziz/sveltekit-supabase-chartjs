<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import type { Organization } from '$types';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';
	import SvelteTable, { type TableColumns } from 'svelte-table';
	import TableActions from '$lib/components/dashboard/TableActions.svelte';
	import { PlusIcon } from 'svelte-feather-icons';
	import Pagination from '$lib/components/dashboard/Pagination.svelte';
	import CreateOrgForm from '$lib/components/forms/CreateOrgForm.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createOrganizationSchema } from '$lib/validators/organization';
	import OrgTableAction from '$lib/components/dashboard/OrgTableAction.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: orgsData = data.orgsData;
	$: orgs = orgsData?.content;
	const pathname = $page.url.pathname;
	let isModalOpen = false;

	const superForm = superFormApi(data.form!, {
		validators: zod(createOrganizationSchema)
	});

	// https://kit.svelte.dev/docs/form-actions#progressive-enhancement-custom-event-listener
	const deleteAction = async (id: Organization['id']) => {
		const data = new FormData();
		data.append('id', id);
		const response = await fetch('orgs?/delete', {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			await invalidateAll();
			toast.success('Organization deleted successfully');
		}

		applyAction(result);
	};

	const onAction = (a: any) => {
		switch (a.action) {
			case 'delete':
				deleteAction(a.row.id);
				break;
		}
	};

	$: if (form?.error) toast.error('Failed to add organization, please try again');

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
			value: (v: any) => v.created_at,
			sortable: true
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
		<span slot="title">Organizations</span>
		<div slot="content" class="bg-base-100 p-5 rounded">
			<div class="flex items-center mb-5">
				<p class="text-lg font-semibold">
					Total organizations <span class="text-primary font-bold">({orgsData.totalRow})</span>
				</p>

				<div class="tooltip ml-auto" data-tip="Create user">
					<label for="add_org_modal" class="btn btn-outline btn-square btn-sm">
						<PlusIcon class="w-4 h-4" />
					</label>
				</div>
			</div>
			<SvelteTable
				{columns}
				rows={orgs}
				classNameTable={'table divide-y'}
				classNameTbody={'divide-y'}
			/>
			<div class="w-full mt-7">
				<Pagination {...orgsData} {pathname} />
			</div>
		</div>
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
