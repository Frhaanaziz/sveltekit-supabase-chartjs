<script lang="ts">
	import { page } from '$app/stores';
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import type { ActionData, PageData } from './$types';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import CreateUserForm from '$lib/components/forms/CreateUserForm.svelte';
	import { createUserSchema } from '$lib/validators/user';
	import { zod } from 'sveltekit-superforms/adapters';
	import RoleBadge from '$lib/components/dashboard/tables/RoleBadge.svelte';
	import UserTableAction from '$lib/components/dashboard/tables/UserTableAction.svelte';
	import type { ProfileWithOrg } from '$types';
	import type { TableColumns } from 'svelte-table';
	import { PlusIcon } from 'svelte-feather-icons';
	import SvelteTable from 'svelte-table';
	import Pagination from '$lib/components/dashboard/tables/Pagination.svelte';
	import RelativeDate from '$lib/components/dashboard/tables/RelativeDate.svelte';

	export let data: PageData;
	export let form: ActionData;

	const pathname = $page.url.pathname;
	const orgs = data.orgs;
	$: profilesData = data.profilesData;
	let isModalOpen = false;

	const superForm = superFormApi(data.form!, {
		validators: zod(createUserSchema)
	});

	const columns = [
		{
			key: 'name',
			title: 'Name',
			value: (v) => v.name,
			sortable: true
		},
		{
			key: 'email',
			title: 'Email',
			value: (v) => v.email,
			sortable: true
		},
		{
			key: 'role',
			title: 'Role',
			value: (v) => v.role,
			renderComponent: RoleBadge,
			sortable: true
		},
		{
			key: 'org',
			title: 'Organization',
			value: (v) => v.org_id?.name ?? '',
			sortable: true
		},
		{
			key: 'created',
			title: 'Created At',
			value: (v) => v.created_at,
			sortable: true,
			renderComponent: {
				component: RelativeDate,
				props: { column: 'created_at' }
			}
		},
		{
			key: 'actions',
			title: 'Actions',
			renderComponent: {
				component: UserTableAction
			}
		}
	] satisfies TableColumns<ProfileWithOrg>;
</script>

{#if profilesData}
	<DashboardPage {pathname}>
		<h1 slot="title">Users</h1>

		<section slot="content" class="bg-base-100 p-5 rounded">
			<div class="flex items-center mb-5">
				<h2 class="text-lg font-semibold">
					Total Users <span class="text-primary font-bold">({profilesData.totalRow})</span>
				</h2>

				<div class="tooltip ml-auto" data-tip="Create user">
					<label for="add_user_modal" class="btn btn-outline btn-square btn-sm">
						<PlusIcon class="w-4 h-4" />
					</label>
				</div>
			</div>

			<div class="overflow-x-auto">
				<SvelteTable
					{columns}
					rows={profilesData.content}
					classNameTable={'table divide-y min-w-[900px]'}
					classNameTbody={'divide-y'}
				/>
			</div>

			<div class="w-full mt-7">
				<Pagination {...profilesData} {pathname} />
			</div>
		</section>
	</DashboardPage>
{/if}

<input type="checkbox" id="add_user_modal" class="modal-toggle" bind:checked={isModalOpen} />
<div class="modal" role="dialog" class:modal-open={isModalOpen}>
	<div class="modal-box max-w-2xl">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			on:click={() => (isModalOpen = false)}>✕</button
		>

		<CreateUserForm
			{superForm}
			{orgs}
			formAction={form}
			on:closeModal={() => (isModalOpen = false)}
		/>
	</div>
</div>
