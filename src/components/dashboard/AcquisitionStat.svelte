<script lang="ts">
	import { ArrowDownIcon, ArrowUpIcon } from 'svelte-feather-icons';
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Tooltip,
		LineElement,
		Filler,
		PointElement,
		type ChartData
	} from 'chart.js';

	ChartJS.register(Tooltip, LineElement, PointElement, Filler);

	let width: number, height: number, gradient: CanvasGradient;
	function getGradient(ctx: CanvasRenderingContext2D, chartArea: any) {
		const chartWidth = chartArea.right - chartArea.left;
		const chartHeight = chartArea.bottom - chartArea.top;
		if (!gradient || width !== chartWidth || height !== chartHeight) {
			width = chartWidth;
			height = chartHeight;
			gradient = ctx.createLinearGradient(chartArea.bottom, 0, chartArea.top, 0);
			gradient.addColorStop(0, 'rgb(228,232,255)');
			gradient.addColorStop(0.1, 'rgb(255,235,237)');
			gradient.addColorStop(1, 'rgb(228,232,255)');
		}

		return gradient;
	}

	const data = {
		labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		datasets: [
			{
				label: 'Sessions',
				data: [10, 14, 16, 14, 12, 15, 18, 21, 24, 23, 21, 17, 19, 22],
				fill: 'start',
				borderWidth: 2,
				pointRadius: 0,
				borderColor: 'rgba(62, 96, 213, 0.85)',
				backgroundColor: function (context) {
					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						// This case happens on initial chart load
						return;
					}
					return getGradient(ctx, chartArea);
				}
			}
		]
	} satisfies ChartData<'line'>;
</script>

<div class="bg-base-100 pb-5">
	<h2 class="text-lg font-semibold p-5 pb-4 m-0">Revenue Statistic</h2>

	<div class="border-y py-3">
		<div class="grid grid-cols-3 divide-x">
			<div class="flex items-center flex-col gap-2">
				<p class="font-medium">Users</p>
				<p class="text-2xl font-semibold">427</p>
				<div class="flex items-center gap-1 text-green-600">
					<ArrowUpIcon class="h-3.5 w-3.5" />
					<span class="text-xs font-semibold">3.15%</span>
				</div>
			</div>
			<div class="flex items-center flex-col gap-2">
				<p class="font-medium">Sessions</p>
				<p class="text-2xl font-semibold">34</p>
				<div class="flex items-center gap-1 text-green-600">
					<ArrowDownIcon class="h-3.5 w-3.5" />
					<span class="text-xs font-semibold">-2.78%</span>
				</div>
			</div>
			<div class="flex items-center flex-col gap-2">
				<p class="font-medium">Bounce Rate</p>
				<p class="text-2xl font-semibold">40.5%</p>
				<div class="flex items-center gap-1 text-green-600">
					<ArrowUpIcon class="h-3.5 w-3.5" />
					<span class="text-xs font-semibold">5.14%</span>
				</div>
			</div>
		</div>
	</div>

	<!-- remove the point -->
	<Line
		{data}
		class="mx-5 mt-5"
		options={{
			responsive: true,
			plugins: {
				filler: {
					propagate: false
				},
				legend: {
					display: false
				}
			},
			interaction: {
				intersect: false
			},
			elements: {
				line: {
					tension: 0.4
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					},
					ticks: {
						display: false
					},
					border: {
						width: 0
					}
				},
				y: {
					grid: {
						display: false
					},
					ticks: {
						display: false
					},
					border: {
						width: 0
					}
				}
			}
		}}
	/>
</div>
