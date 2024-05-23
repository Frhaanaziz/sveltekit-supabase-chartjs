<script lang="ts">
	import { Bar } from 'svelte-chartjs';

	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		type ChartData
	} from 'chart.js';
	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	export const data = {
		labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
		datasets: [
			{
				label: 'Orders',
				data: [
					1199.18, 2276.09, 3081.37, 2462.86, 1811.89, 5543.21, 2589.27, 2446.85, 5332.38, 2673.53
				],
				backgroundColor: 'rgba(62, 96, 213, 0.85)'
			},
			{
				label: 'Revenue',
				data: [3650, 4380, 5110, 5840, 6570, 7300, 5110, 5840, 6570, 4380],
				backgroundColor: 'rgba(62, 213, 185, 0.85)',
				borderRadius: 10
			}
		]
	} satisfies ChartData<'bar'>;
</script>

<div class="bg-base-100 p-5 shadow">
	<div class="flex justify-between">
		<div>
			<h2 class="text-lg font-semibold">Revenue Statistic</h2>
			<div class="flex items-center gap-3 mt-2">
				<p class="text-4xl font-semibold">$12,547K</p>
				<p class="text-green-600 font-semibold text-sm">+3.24%</p>
			</div>
			<p class="text-sm text-zinc-500 mt-1">Total income in this year</p>
		</div>

		<div class="hidden lg:block">
			<div role="tablist" class="tabs tabs-boxed tabs-sm">
				<span role="tab" class="tab my-0.5">Day</span>
				<span role="tab" class="tab my-0.5 tab-active">Month</span>
				<span role="tab" class="tab my-0.5">Year</span>
			</div>
		</div>
	</div>

	<Bar
		{data}
		class="mt-6"
		height={125}
		options={{
			responsive: true,
			plugins: {
				legend: { position: 'bottom' }
			},
			scales: {
				x: {
					stacked: true
				},
				y: {
					stacked: true
				}
			}
		}}
	/>
</div>
