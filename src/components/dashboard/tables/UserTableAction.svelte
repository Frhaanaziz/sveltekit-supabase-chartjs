<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import AlertModal from '../../modals/AlertModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { EditIcon, TrashIcon } from 'svelte-feather-icons';

	export let row: User;
	const modalId = `delete-user-${row.id}`;

	const deleteAction = async (id: User['id']) => {
		const res = await fetch(`/api/users/${id}`, {
			method: 'DELETE'
		});
		if (res.status !== 200) {
			toast.error('Failed to delete user');
			return;
		}

		invalidateAll();
		toast.success('User deleted successfully');
	};
</script>

<div class="join">
	<div class="tooltip ml-auto" data-tip="Edit">
		<a
			href={`/dashboard/_admin/users/${row.id}/update`}
			class="btn btn-square text-blue-500 btn-ghost btn-sm hover:bg-base-200"
		>
			<EditIcon class="w-5 h-5" />
		</a>
	</div>

	<AlertModal onContinue={() => deleteAction(row.id)} id={modalId}>
		<div class="tooltip ml-auto" data-tip="Delete">
			<label
				for={`alert_modal-${modalId}`}
				class="btn btn-square text-error btn-ghost btn-sm hover:bg-base-200"
			>
				<TrashIcon class="w-5 h-5" />
			</label>
		</div>
	</AlertModal>
</div>
