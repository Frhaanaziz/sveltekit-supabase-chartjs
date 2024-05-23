<script lang="ts">
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		RadialLinearScale,
		type ChartData
	} from 'chart.js';
	import { PolarArea } from 'svelte-chartjs';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);

	const data = {
		labels: ['Males', 'Females', 'Unknown'],
		datasets: [
			{
				label: 'Session by gender',
				data: [500, 326, 242],
				backgroundColor: [
					'rgba(55, 48, 163, .6)',
					'rgba(56, 189, 248, .6)',
					'rgba(16, 185, 129, .6)'
				]
			}
		]
	} satisfies ChartData<'polarArea'>;
</script>

<div class="bg-base-100 p-5 shadow">
	<h2 class="text-lg font-semibold border-b pb-4">Sessions By Gender</h2>

	<PolarArea
		{data}
		class="max-h-72 mt-5"
		options={{
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom'
				}
			}
		}}
	/>
</div>
