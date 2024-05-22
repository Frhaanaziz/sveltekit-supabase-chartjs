<script lang="ts">
	import { formatDateWithTime, getRelativeTimeString } from '$lib/utils';

	export let row: any;
	export let column: any;

	$: value = row[column];
</script>

<div class="tooltip" data-tip={formatDateWithTime(value)}>
	<span class="hover:underline">{getRelativeTimeString(value)}</span>
</div>
