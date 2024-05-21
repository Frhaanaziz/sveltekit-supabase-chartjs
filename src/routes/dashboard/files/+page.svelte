<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import DashboardPage from '$lib/components/dashboard/DashboardPage.svelte';
	import FilesTable from '$lib/components/dashboard/FilesTable.svelte';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';

	export let data: PageData;
	let view = 'home';
	const pathname = $page.url.pathname;

	const handleUpload = async (event: any) => {
		const file = event.target.files[0];

		// const res = await supabase.storage.from('TEST').upload('TEST/' + file.name, file);

		// if (res.error) {
		// 	toast.error('FILE UPLOAD ERROR!');
		// } else {
		// 	toast.success('File upload succesful!');
		// }

		view = 'home';
		invalidateAll();
	};
</script>

{#if view == 'home'}
	<DashboardPage {pathname}>
		<span slot="title">Files</span>
		<span slot="content" class="w-full">
			<FilesTable files={data.files} />
		</span>
	</DashboardPage>
{:else if view == 'upload'}
	<DashboardPage {pathname}>
		<span slot="title">Upload</span>

		<span slot="content" class="w-full">
			<input
				required
				id="file"
				name="file"
				type="file"
				class="file-input w-full"
				on:change={handleUpload}
			/>
		</span>
	</DashboardPage>
{/if}
