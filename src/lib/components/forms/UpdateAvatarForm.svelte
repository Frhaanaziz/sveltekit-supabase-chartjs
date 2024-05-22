<script lang="ts">
	import type { updateAvatarSchema } from '$lib/validators/user';
	import type { Profile } from '$types';
	import { fileProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';
	import toast from 'svelte-french-toast';
	import { TrashIcon, UploadIcon } from 'svelte-feather-icons';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	type UpdateAvatarType = z.infer<typeof updateAvatarSchema>;

	export let superForm: SuperForm<UpdateAvatarType>;
	export let profile: Profile;
	$: isRemoving = false;

	const { form, errors, enhance, submitting, submit } = superForm;
	const file = fileProxy(form, 'avatar');

	onMount(() => {
		$form.id = profile.id;
	});

	$: if ($errors.avatar) toast.error($errors.avatar[0]);

	const removeAvatar = async () => {
		isRemoving = true;

		const data = new FormData();
		data.append('id', profile.id);
		const response = await fetch('?/removeAvatar', {
			method: 'POST',
			body: data
		});
		const result: ActionResult = deserialize(await response.text());
		if (result.type === 'success') await invalidateAll();
		applyAction(result);

		isRemoving = false;
	};
</script>

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
			<form method="POST" action="?/updateAvatar" enctype="multipart/form-data" use:enhance>
				<input type="hidden" name="id" bind:value={$form.id} />
				<input
					type="file"
					id="avatar"
					name="avatar"
					class="hidden"
					bind:files={$file}
					multiple={false}
					accept="image/png, image/jpeg, image/jpg"
					on:change={submit}
				/>
				<label
					for="avatar"
					class="btn btn-xs btn-primary gap-2 rounded"
					class:btn-disabled={$submitting || isRemoving}
				>
					<UploadIcon class="w-3.5 h-3.5" />
					Upload Image</label
				>
			</form>

			<button
				type="submit"
				class="btn btn-xs gap-2 rounded"
				on:click={async () => await removeAvatar()}
				class:btn-disabled={!profile.avatar || isRemoving}
			>
				<TrashIcon class="w-3.5 h-3.5" />
				Remove</button
			>
		</div>
		<p class="text-xs">We support PNG, JPEG, JPG under 1MB</p>
	</div>
</div>
