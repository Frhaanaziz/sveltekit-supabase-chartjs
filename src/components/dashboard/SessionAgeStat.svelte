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
		labels: ['<18', '18-24', '24-36', '>35'],
		datasets: [
			{
				data: [30, 50, 5, 15],
				backgroundColor: [
					'rgb(55, 48, 163)',
					'rgb(56, 189, 248)',
					'rgb(244, 63, 94)',
					'rgb(16, 185, 129)'
				],
				hoverBackgroundColor: [
					'rgb(49, 43, 147)',
					'rgb(27, 179, 247)',
					'rgb(242, 34, 70)',
					'rgb(14, 166, 116)'
				]
			}
		]
	} satisfies ChartData<'doughnut'>;
</script>

<div class="bg-base-100 p-5 shadow">
	<h2 class="text-lg font-semibold border-b pb-4">Sessions By Age</h2>

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
