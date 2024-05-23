<script lang="ts">
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		type ChartData
	} from 'chart.js';
	import { Doughnut } from 'svelte-chartjs';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	const data = {
		labels: ['Desktop', 'Mobile', 'Tablet', 'Others'],
		datasets: [
			{
				data: [38, 12, 45, 5],
				backgroundColor: [
					'rgb(99, 102, 241)',
					'rgb(56, 189, 248)',
					'rgb(55, 48, 163)',
					'rgb(148, 159, 177)'
				],
				hoverBackgroundColor: [
					'rgb(68, 71, 238)',
					'rgb(27, 179, 247)',
					'rgb(49, 43, 147)',
					'rgb(129, 142, 163)'
				]
			}
		]
	} satisfies ChartData<'doughnut'>;
</script>

<div class="bg-base-100 p-5 shadow">
	<h2 class="text-lg font-semibold border-b pb-4">Sessions By Device</h2>

	<Doughnut
		{data}
		class="max-h-72 mt-5"
		options={{
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom'
				}
			},
			cutout: '80%'
		}}
	/>
</div>
