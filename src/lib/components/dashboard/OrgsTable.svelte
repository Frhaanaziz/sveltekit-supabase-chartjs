<script lang="ts">
	import SvelteTable, { type TableColumns } from 'svelte-table';
	import type { Organization } from '../../../types';
	import TableActions from './TableActions.svelte';
	import TimeInTable from './TimeInTable.svelte';
	export let orgs: Organization[];
	export let onAction;

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
			value: (v: any) => v.profiles.name,
			sortable: true
		},
		{
			key: 'created_at',
			title: 'Created at',
			value: (v: any) => v.created_at,
			sortable: true,
			renderComponent: {
				component: TimeInTable,
				props: { field: 'created_at', format: 'YYYY-MM-DD HH:mm' }
			}
		},
		{
			key: 'delete-action',
			title: '',
			renderComponent: {
				component: TableActions,
				props: { actions: ['delete'], onAction }
			}
		}
	] satisfies TableColumns<Organization>;
</script>

<SvelteTable
	{columns}
	rows={orgs}
	sortBy="name"
	classNameTable={'table table-compact table-zebra'}
	classNameThead={'bg-black'}
/>
