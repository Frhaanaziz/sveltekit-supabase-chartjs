<script>
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import {
		DollarSignIcon,
		EyeIcon,
		PackageIcon,
		UsersIcon
	} from 'svelte-feather-icons';

	export const statsData = [
		{
			id: 1,
			type: 'Revenue',
			amount: '$587.54',
			percentage: 2.5,
			weekAmount: '+$112.58',
			Icon: DollarSignIcon
		},
		{
			id: 2,
			type: 'Orders',
			amount: '1,345',
			percentage: -1.5,
			weekAmount: '-$34.56',
			Icon: PackageIcon
		},
		{
			id: 3,
			type: 'Users',
			amount: '45,678',
			percentage: 0.5,
			weekAmount: '+$1,234.56',
			Icon: UsersIcon
		},
		{
			id: 4,
			type: 'Visitors',
			amount: '123,456',
			percentage: -0.5,
			weekAmount: '-$12.34',
			Icon: EyeIcon
		}
	];
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<h1>Overview</h1>

<section class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-5">
	{#each statsData as { Icon, ...stat }}
		<StatCard {...stat}>
			<Icon class="h-5 w-5" slot="icon" />
		</StatCard>
	{/each}
</section>
