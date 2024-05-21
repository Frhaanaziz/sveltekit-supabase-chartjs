<script lang="ts">
	import type { Session, User } from '@supabase/supabase-js';
	import { getContext } from 'svelte';
	import { BellIcon, ChevronDownIcon, LogOutIcon, MenuIcon, UserIcon } from 'svelte-feather-icons';

	const session = getContext('session') as Session;
	const user = session.user;
</script>

<div
	class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 px-4 border-b sm:gap-x-6 sm:px-6 lg:px-8 bg-base-100 shadow"
>
	<label for="my-drawer-2" class="-m-2.5 p-2.5 lg:hidden">
		<span class="sr-only">Open sidebar</span>
		<MenuIcon class="h-6 w-6" strokeWidth={1.5} />
	</label>

	<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
		<div class="flex-1" />

		<div class="flex items-center gap-x-4">
			<button type="button" class="btn btn-circle btn-sm btn-ghost">
				<span class="sr-only">View notifications</span>
				<BellIcon class="h-5 w-5" strokeWidth={1.5} />
			</button>

			<!-- Profile dropdown -->
			<div class="relative dropdown dropdown-end dropdown-hover">
				<div tabindex="0" role="button" class="btn rounded btn-ghost px-2 space-x-3">
					<span class="sr-only">Open user menu</span>

					<img
						class="h-8 w-8 rounded-full"
						src={user?.app_metadata?.avatar ?? '/avatar-fallback.png'}
						alt={user?.app_metadata?.name ?? 'YOUR NAME'}
					/>
					<span class="hidden lg:flex lg:items-center gap-2">
						<span class="text-sm font-semibold leading-6"
							>{user?.app_metadata?.name ?? 'YOUR NAME'}</span
						>
						<ChevronDownIcon class="h-5 w-5" />
					</span>
				</div>

				<ul class="dropdown-content menu shadow bg-base-100 w-48 p-2 [&_li>*]:rounded-none text-sm">
					<li>
						<a href="/dashboard/settings" class="py-2 px-4">
							<UserIcon class="h-4 w-4" />
							My Profile
						</a>
					</li>
					<li class="text-error">
						<form action="/auth?/signout" method="POST">
							<button type="submit" class="flex items-center gap-3 flex-start">
								<LogOutIcon class="h-4 w-4" />
								Logout
							</button>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
