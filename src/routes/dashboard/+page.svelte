<script>
	import AcquisitionStat from '$components/dashboard/AcquisitionStat.svelte';
	import RevenueStat from '$components/dashboard/RevenueStat.svelte';
	import SessionAgeStat from '$components/dashboard/SessionAgeStat.svelte';
	import SessionDeviceStat from '$components/dashboard/SessionDeviceStat.svelte';
	import SessionGenderStat from '$components/dashboard/SessionGenderStat.svelte';
	import StatCard from '$components/dashboard/StatCard.svelte';
	import { DollarSignIcon, EyeIcon, PackageIcon, UsersIcon } from 'svelte-feather-icons';

	/**
	 * This Svelte component represents a dashboard page with multiple sections.
	 *
	 * @section Stats
	 * This section displays a grid of stat cards, where each card represents a statistic.
	 * The `statsData` array is iterated using the `each` block, and each card is rendered with the corresponding data.
	 * The `Icon` component is used to display an icon for each stat, and the `StatCard` component is used to display the stat value.
	 *
	 * @section Revenue and Acquisition Stats
	 * This section displays two columns, where the left column spans 7 columns and the right column spans 5 columns.
	 * The `RevenueStat` component is rendered in the left column, and the `AcquisitionStat` component is rendered in the right column.
	 *
	 * @section Session Stats
	 * This section displays a grid of session-related stats, where each stat is represented by a separate component.
	 * The `SessionDeviceStat`, `SessionAgeStat`, and `SessionGenderStat` components are rendered in a grid with 3 columns.
	 *
	 * @note
	 * This code assumes that the necessary components (`StatCard`, `RevenueStat`, `AcquisitionStat`, `SessionDeviceStat`, `SessionAgeStat`, `SessionGenderStat`) are imported and defined elsewhere in the codebase.
	 */
	const statsData = [
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

<section class="grid grid-cols-1 lg:grid-cols-12 mt-5 gap-5">
	<div class="lg:col-span-7">
		<RevenueStat />
	</div>
	<div class="lg:col-span-5">
		<AcquisitionStat />
	</div>
</section>

<section class="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-3">
	<SessionDeviceStat />
	<SessionAgeStat />
	<SessionGenderStat />
</section>
