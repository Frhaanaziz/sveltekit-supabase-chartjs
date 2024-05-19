<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import UsersTable from '$lib/components/dashboard/UsersTable.svelte';
	import { roleSuper } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const orgs = data.orgs;
	const users = data.users;
	const session = data.session;
	if (!orgs || !users || !session) throw new Error('Missing data');

	const pathname = $page.url.pathname;
	let view = 'home';

	// https://kit.svelte.dev/docs/form-actions#progressive-enhancement-custom-event-listener
	const deleteAction = async (id: string) => {
		const data = new FormData();
		data.append('id', id);
		const response = await fetch('users?/delete', {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());
		await invalidateAll();
		applyAction(result);
	};

	const onAction = (a: any) => {
		switch (a.action) {
			case 'delete':
				deleteAction(a.row.id);
				break;
		}
	};

	$: {
		if (form?.success) {
			view = 'home';
			toast.success(form.success);
		}
		if (form?.error) {
			toast.error(form.error);
		}
	}

	let disabled = true;
	let password = '';
	let password2 = '';

	$: {
		if (password == password2) {
			disabled = false;
		} else {
			disabled = true;
		}
	}
</script>

{#if view == 'home'}
	<DashboardPage {pathname}>
		<span slot="title">Users</span>

		<!-- <ActionButton
			class="btn-warning"
			text="add user"
			onAction={() => {
				view = 'add';
			}}
		>
			<span slot="icon"><PlusIcon /></span>
		</ActionButton> -->

		<span slot="content" class="w-full">
			<div class="card flex-col lg:flex-row bg-base-300 shadow-xl">
				<div
					class="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400 overflow-y-scroll"
				>
					<UsersTable {users} {onAction} />
				</div>
			</div>
		</span>
	</DashboardPage>
{:else if (view = 'add')}
	<DashboardPage {pathname}>
		<span slot="title"> Add user </span>
		<!-- <ActionButton
			text="CANCEL"
			onAction={() => {
				view = 'home';
			}}
		>
			<span slot="icon"><XIcon /></span>
		</ActionButton> -->

		<span slot="content" class="w-full h-full">
			<form method="POST" action="?/create" use:enhance>
				<div class="form-control mt-5">
					<label class="input-group">
						<span class="w-1/5 text-xl bg-primary">Email</span>
						<input
							autocomplete="username"
							id="email"
							name="email"
							class="w-4/5 input input-bordered"
							type="email"
							placeholder="email"
							required
						/>
					</label>
				</div>

				{#if roleSuper(session)}
					<div class="form-control mt-5">
						<label class="input-group">
							<span class="w-1/5 text-xl bg-primary">Organization</span>
							<select id="org" name="org" class="select select-bordered w-4/5">
								<option disabled selected>Organization</option>
								{#each orgs as org}
									<option value={JSON.stringify(org)} class="block w-full">{org.name}</option>
								{/each}
							</select>
						</label>
					</div>
				{/if}

				<div class="form-control mt-5">
					<label class="input-group">
						<span class="w-1/5 text-xl bg-primary">Role</span>
						<select id="role" name="role" class="w-4/5 select select-bordered">
							<option disabled selected>Role</option>
							<option value="user">User</option>
							<option value="admin">Admin</option>
							{#if roleSuper(session)}
								<option value="super">Super</option>
							{/if}
						</select>
					</label>
				</div>

				<div class="form-control mt-5">
					<label class="input-group">
						<span class="w-1/5 text-xl bg-primary">Password</span>
						<input
							autocomplete="current-password"
							id="password"
							name="password"
							class="w-4/5 input input-bordered"
							type="password"
							placeholder="enter password"
							required
						/>
					</label>
				</div>

				<div class="form-control mt-5">
					<label class="input-group">
						<span class="w-1/5 text-xl bg-primary">Confirm</span>
						<input
							autocomplete="current-password"
							id="password"
							name="password"
							class="w-4/5 input input-bordered"
							type="password"
							placeholder="confirm password"
							required
						/>
					</label>
				</div>

				<div class="form-control mt-6">
					<button class:btn-disabled={disabled} class="btn btn-primary">ADD USER</button>
				</div>
			</form>
		</span>
	</DashboardPage>
{/if}
