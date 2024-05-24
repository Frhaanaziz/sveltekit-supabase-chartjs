<script lang="ts">
	import type { loginSchema } from '$lib/validators/auth';
	import { KeyIcon, LogInIcon, MailIcon } from 'svelte-feather-icons';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';

	type LogInType = z.infer<typeof loginSchema>;

	export let superForm: SuperForm<LogInType>;

	const { form, errors, enhance, submitting } = superForm;
</script>

<form method="POST" use:enhance class="mt-10">
	<div class="form-control">
		<label class="label" for="email"><span class="label-text">Email Address</span></label>
		<div
			class="form-control flex flex-row items-center rounded-box border border-base-content/20 px-3"
		>
			<MailIcon class="text-base-content/80 w-5 h-5" />
			<input
				placeholder="Email Address"
				class="input w-full focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0"
				name="email"
				id="email"
				bind:value={$form.email}
			/>
		</div>
		{#if $errors.email}
			<div class="label">
				<span class="label-text-alt text-error">{$errors.email}</span>
			</div>
		{/if}
	</div>
	<div class="form-control mt-3">
		<label class="label" for="password"><span class="label-text">Password</span></label>
		<div
			class="form-control flex flex-row items-center rounded-box border border-base-content/20 px-3"
		>
			<KeyIcon class="text-base-content/80 w-5 h-5" />
			<input
				type="password"
				placeholder="Password"
				class="input w-full focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0"
				name="password"
				id="password"
				bind:value={$form.password}
			/>
		</div>
		<div class="label">
			{#if $errors.password}
				<span class="label-text-alt text-error">{$errors.password}</span>
			{/if}
			<span class="label-text"></span><a
				class="label-text text-xs text-base-content/80"
				href="/auth/forgot-password">Forgot Password?</a
			>
		</div>
	</div>

	<div class="mt-3 flex items-center gap-3">
		<input
			id="agreement"
			type="checkbox"
			class="checkbox checkbox-xs checkbox-primary"
			name="agreement"
		/><label for="agreement"
			>I agree with <span class="cursor-pointer text-primary underline">terms and conditions</span
			></label
		>
	</div>
	<div class="mt-6">
		<button class="btn text-base gap-2 btn-primary btn-block" class:btn-disabled={$submitting}>
			<LogInIcon class="w-5 h-5" />
			Login</button
		>
	</div>

	<p class="mt-6 text-center text-sm text-base-content/80">
		Haven't account
		<a class="text-primary hover:underline" href="/auth/register">Create One</a>
	</p>
</form>
