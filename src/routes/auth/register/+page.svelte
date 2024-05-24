<script lang="ts">
	import { registerSchema } from '$lib/validators/auth';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types.js';
	import toast from 'svelte-french-toast';
	import RegisterForm from '$components/forms/RegisterForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	const superForm = superFormApi(data.form, {
		validators: zod(registerSchema)
	});

	$: if (form?.error) toast.error(form.error);
</script>

<h3 class="mt-12 text-center text-xl font-semibold lg:mt-24">Register</h3>
<h3 class="mt-2 text-center text-sm text-base-content/70">
	Seamless Access, Secure Connection: Your Gateway to a Personalized Experience.
</h3>
<RegisterForm {superForm} />
