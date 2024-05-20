import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';
import type { Database } from '$types/supabase';

export const supabaseAdminClient = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PRIVATE_SUPABASE_SERVICE_KEY
);
