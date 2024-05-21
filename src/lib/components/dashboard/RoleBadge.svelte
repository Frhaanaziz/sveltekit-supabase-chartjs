<script lang="ts">
	export let row;
	const role = row.role;
</script>

<div
	class="badge badge-outline"
	class:badge-success={role === 'user'}
	class:badge-warning={role === 'admin'}
	class:badge-error={role === 'super'}
>
	{role}
</div>
