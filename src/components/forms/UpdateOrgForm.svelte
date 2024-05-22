<script lang="ts">
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import FormField from './FormField.svelte';
	import toast from 'svelte-french-toast';
	import { invalidate } from '$app/navigation';
	import type { updateOrganizationSchema } from '$lib/validators/organization';
	import type { ActionData } from '../../routes/dashboard/_super/orgs/[id]/update/$types';

	type UpdateOrgType = z.infer<typeof updateOrganizationSchema>;

	export let formAction: ActionData;
	export let superForm: SuperForm<UpdateOrgType>;

	const { form, errors, enhance, reset, submitting } = superForm;

	function handleSuccess() {
		reset();
		toast.success('Organization updated successfully');
		invalidate('/dashboard/_super/orgs');
	}

	$: {
		if (formAction?.error) toast.error(formAction.error);
		if (formAction?.success) handleSuccess();
	}
</script>

<form method="POST" action="?/updateOrg" use:enhance class="space-y-5">
	<input type="hidden" name="id" bind:value={$form.id} />
	<FormField label="Name" error={$errors.name}>
		<input
			name="name"
			placeholder="Enter organization name"
			class="input input-bordered"
			bind:value={$form.name}
		/>
	</FormField>

	<div class="flex justify-end pt-2 gap-5">
		<a href="/dashboard/_super/orgs" class="btn btn-error" class:btn-disabled={$submitting}
			>Cancel</a
		>

		<button type="submit" class:btn-disabled={$submitting} class="btn">Update</button>
	</div>
</form>
