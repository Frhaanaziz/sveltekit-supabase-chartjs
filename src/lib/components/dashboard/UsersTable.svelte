<script lang="ts">
	import SvelteTable, { type TableColumns } from 'svelte-table';
	import RoleBadge from './RoleBadge.svelte';
	import TimeInTable from './TimeInTable.svelte';

	import UserTableAction from './UserTableAction.svelte';
	import type { PaginatedProfiles, ProfileWithOrg } from '$types';
	import { PlusIcon } from 'svelte-feather-icons';
	import Pagination from './Pagination.svelte';
	import TableSearchInput from './TableSearchInput.svelte';

	export let profilesData: PaginatedProfiles;
	export let pathname: string;
	const { content: users, ...paginationUtils } = profilesData;

	const columns = [
		{
			key: 'name',
			title: 'NAME',
			value: (v) => v.name,
			sortable: true
		},
		{
			key: 'email',
			title: 'EMAIL',
			value: (v) => v.email,
			sortable: true
		},
		{
			key: 'role',
			title: 'ROLE',
			value: (v) => v.role,
			renderComponent: RoleBadge,
			sortable: true
		},
		{
			key: 'org',
			title: 'ORG',
			value: (v) => v.org_id?.name ?? '',
			sortable: true
		},
		{
			key: 'created',
			title: 'CREATED',
			value: (v) => v.created_at,
			sortable: true,
			renderComponent: {
				component: TimeInTable,
				props: { field: 'created_at', format: 'YY-MM-DD HH:mm' }
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

<div class="flex items-center mb-5">
	<TableSearchInput {pathname} />

	<div class="tooltip ml-auto" data-tip="Create user">
		<label for="add_user_modal" class="btn btn-outline btn-square btn-sm">
			<PlusIcon class="w-4 h-4" />
		</label>
	</div>
</div>

<SvelteTable
	{columns}
	rows={users}
	classNameTable={'table divide-y'}
	classNameTbody={'divide-y'}
	classNameRow=""
/>

<div class="w-full mt-7">
	<Pagination {...paginationUtils} {pathname} />
</div>
