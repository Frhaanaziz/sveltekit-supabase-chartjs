<script lang="ts">
	import type { createUserSchema } from '$lib/validators/user';
	import type { Organization } from '$types';
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import FormField from './FormField.svelte';
	import type { ActionData } from '../../../routes/dashboard/_admin/users/$types';
	import toast from 'svelte-french-toast';
	import { createEventDispatcher } from 'svelte';
	import { invalidate } from '$app/navigation';

	type CreateUserType = z.infer<typeof createUserSchema>;

	export let formAction: ActionData;
	export let superForm: SuperForm<CreateUserType>;
	export let orgs: Pick<Organization, 'id' | 'name'>[] = [];

	const { form, errors, enhance, reset, submitting } = superForm;

	const dispatch = createEventDispatcher();

	function handleSuccess() {
		reset();
		dispatch('closeModal');
		toast.success('User created successfully');
		invalidate('/dashboard/_admin/users');
	}

	$: {
		if (formAction?.error) toast.error('Failed to create user, please try again later');
		if (formAction?.success) handleSuccess();
	}
</script>

<form method="POST" action="?/createUser" use:enhance class="space-y-5">
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

	<div class="md:grid grid-cols-2 gap-5">
		<FormField label="Password" error={$errors.password}>
			<input
				name="password"
				type="password"
				placeholder="Enter password"
				class="input input-bordered"
				bind:value={$form.password}
			/>
		</FormField>

		<FormField label="Confirm Password" error={$errors.confirmPassword}>
			<input
				name="confirmPassword"
				type="password"
				placeholder="Confirm password"
				class="input input-bordered"
				bind:value={$form.confirmPassword}
			/>
		</FormField>
	</div>

	<div class="flex justify-end pt-2 gap-5">
		<button class="btn btn-error" on:click|preventDefault={() => dispatch('closeModal')}
			>Cancel</button
		>

		<button type="submit" class:btn-disabled={$submitting} class="btn">ADD USER</button>
	</div>
</form>
