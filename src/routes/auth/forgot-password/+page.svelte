<script lang="ts">
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { forgotPasswordSchema } from '$lib/validators/auth';
	import ForgotPasswordForm from '$components/forms/ForgotPasswordForm.svelte';

	export let form: ActionData;
	export let data: PageData;

	const superForm = superFormApi(data.form, {
		validators: zod(forgotPasswordSchema)
	});

	$: if (form?.error) toast.error(form.error);
	$: if (form?.message) toast.success(form.message);
</script>

<h3 class="mt-12 text-center text-xl font-semibold lg:mt-24">Forgot Password</h3>
<h3 class="mt-2 text-center text-sm text-base-content/70">
	Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
</h3>
<ForgotPasswordForm {superForm} />
