<script lang="ts">
	import type { updateUserSchema } from '$lib/validators/user';
	import type { Organization } from '$types';
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import FormField from './FormField.svelte';
	import type { ActionData } from '../../../routes/dashboard/_admin/users/[id]/update/$types';
	import toast from 'svelte-french-toast';
	import { invalidate } from '$app/navigation';

	type UpdateUserType = z.infer<typeof updateUserSchema>;

	export let formAction: ActionData;
	export let superForm: SuperForm<UpdateUserType>;
	export let orgs: Pick<Organization, 'id' | 'name'>[] = [];

	const { form, errors, enhance, reset, submitting } = superForm;

	async function handleSuccess() {
		reset();
		toast.success('User updated successfully');
		invalidate('/dashboard/_admin/users');
	}

	$: {
		if (formAction?.error) toast.error('Failed to update user, please try again later');
		if (formAction?.success) handleSuccess();
	}
</script>

<form method="POST" action="?/updateUser" use:enhance class="space-y-5">
	<input type="hidden" name="id" bind:value={$form.id} />
	<div class="md:grid grid-cols-2 gap-5">
		<FormField label="Name" error={$errors.name}>
			<input
				name="name"
				placeholder="Enter name"
				class="input input-bordered"
				bind:value={$form.name}
			/>
		</FormField>

		<FormField label="Email" error={$errors.email}>
			<input
				name="email"
				placeholder="your-email@example.com"
				class="input input-bordered"
				bind:value={$form.email}
			/>
		</FormField>
	</div>

	<div class="md:grid grid-cols-2 gap-5">
		<FormField label="Organization" error={$errors.org_id}>
			<select
				name="org_id"
				placeholder="Select organization"
				class="select select-bordered"
				bind:value={$form.org_id}
			>
				{#each orgs as org}
					<option value={org.id}>{org.name}</option>
				{/each}
			</select>
		</FormField>

		<FormField label="Role" error={$errors.role}>
			<select name="role" class="select select-bordered" bind:value={$form.role}>
				<option value="user">User</option>
				<option value="admin">Admin</option>
				<option value="super">Super</option>
			</select>
		</FormField>
	</div>

	<div class="flex justify-end gap-5 pt-2">
		<a class="btn btn-error" href="/dashboard/_admin/users" class:btn-disabled={$submitting}
			>Cancel</a
		>

		<button type="submit" class:btn-disabled={$submitting} class="btn">UPDATE USER</button>
	</div>
</form>
