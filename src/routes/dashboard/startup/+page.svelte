<script lang="ts">
	/**
	 * This file represents the startup page of the dashboard in a SvelteKit application.
	 * It displays different content based on the form's success status and user data.
	 *
	 * @export let data: PageData;
	 * @export let form: ActionData;
	 *
	 * @const {object} user - The user data obtained from `data`.
	 * @const {string} pathname - The current URL pathname obtained from `$page.url.pathname`.
	 *
	 * @function onMount - A lifecycle function that runs after the component is mounted.
	 * It displays an error toast if `form.error` exists.
	 *
	 * @returns {Promise<void>}
	 */
	import DashboardPage from '$components/dashboard/DashboardPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const user = data.user;
	const pathname = $page.url.pathname;

	onMount(async () => {
		if (form?.error) {
			typeof form.error === 'string' && toast.error(form.error);
		}
	});
</script>

<DashboardPage {pathname}>
	<span slot="content">
		<div class="hero bg-base-200">
			<div class="hero-content">
				<div>
					{#if form?.success}
						<h1 class="text-2xl font-bold">Organization created!</h1>
						<h2>Please sign out for the changes to take effect.</h2>
						<form action="/auth?/signout" method="POST">
							<button class="btn btn-primary" type="submit">Sign Out</button>
						</form>
					{:else}
						<h1 class="text-2xl font-bold">Welcome {user?.email}!</h1>
						<h2>This is your first login so please enter a Organization name below.</h2>

						<h2>You will be the Admin for this organization.</h2>

						<form class="w-full" method="POST" action="?/save">
							<div class="mb-6 form-control">
								<label class="input-group">
									<input required name="org" type="text" class="input input-bordered" />
								</label>
							</div>
							<button class="btn btn-primary">Create Organization</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</span>
</DashboardPage>
