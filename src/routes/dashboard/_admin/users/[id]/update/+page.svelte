<script lang="ts">
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import UpdateUserForm from '$lib/components/forms/UpdateUserForm.svelte';
	import { superForm as superFormApi } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateUserSchema } from '$lib/validators/user';
	import { page } from '$app/stores';
	import type { Profile } from '$types';
	import { TrashIcon, UploadIcon } from 'svelte-feather-icons';

	export let data: PageData;
	export let form: ActionData;
	export let profile: Profile;

	const orgs = data.orgs;
	if (!orgs) throw new Error('Missing data');
	const superForm = superFormApi(data.form, {
		validators: zod(updateUserSchema)
	});

	const pathname = $page.url.pathname;
</script>

<DashboardPage {pathname}>
	<span slot="title">Update user</span>

	<div slot="content" class="bg-base-100 p-5 rounded">
		<div class="flex flex-col sm:flex-row items-center gap-5">
			<img
				src={profile?.avatar ?? '/avatar-fallback.png'}
				alt={profile?.name}
				width="100"
				height="100"
				class="rounded"
			/>
			<div class="flex gap-3 flex-col">
				<p class="text-lg font-semibold">Profile Picture</p>
				<div class="flex items-center gap-2">
					<button class="btn btn-xs btn-primary gap-2 rounded">
						<UploadIcon class="w-3.5 h-3.5" />
						Upload Image</button
					>
					<button class="btn btn-xs gap-2 rounded">
						<TrashIcon class="w-3.5 h-3.5" />
						Remove</button
					>
				</div>
				<p class="text-xs">We support PNG, JPEG, JPG under 1MB</p>
			</div>
		</div>

		<UpdateUserForm formAction={form} {superForm} {orgs} />
	</div>
</DashboardPage>
