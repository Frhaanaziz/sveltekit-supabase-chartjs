import { supabaseAdminClient as supabase } from '$lib/server/supabase';
import type { Organization } from '$types';
import { faker } from '@faker-js/faker';
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const roles = ['user', 'admin', 'super'] as const;
const USER_PASSWORD = 'asdfasdf';

export async function POST() {
	console.info('Cleaning up...');
	const users = await supabase.auth.admin.listUsers({
		perPage: 10000
	});
	if (users.error) {
		console.error('Failed to list users', users.error);
		error(500, users.error.message);
	}
	await Promise.all(users.data.users.map((user) => supabase.auth.admin.deleteUser(user.id)));
	await supabase.from('orgs').delete().match({});

	console.info('Creating author...');
	const AUTHOR_EMAIL = 'author@email.com';
	const AUTHOR_NAME = 'Author';
	const authorRes = await supabase.auth.admin.createUser({
		email: AUTHOR_EMAIL,
		email_confirm: true,
		password: USER_PASSWORD,
		app_metadata: { name: AUTHOR_NAME, role: 'super' }
	});
	if (authorRes.error) {
		console.error('Failed to create author', authorRes.error);
		error(500, authorRes.error.message);
	}
	const authorProfileRes = await supabase
		.from('profiles')
		.insert({ id: authorRes.data.user.id, email: AUTHOR_EMAIL, name: AUTHOR_NAME, role: 'super' });
	if (authorProfileRes.error) {
		console.error('Failed to create author profile', authorProfileRes.error);
		error(500, authorProfileRes.error.message);
	}

	console.info('Creating organizations...');
	const organizations: Organization[] = [];
	for (let i = 0; i < faker.number.int({ min: 20, max: 30 }); i++) {
		const created_at = faker.date.past();
		// @ts-expect-error
		const orgRes = await supabase
			.from('orgs')
			.insert({
				name: faker.company.name(),
				created_by: authorRes.data.user.id,
				created_at: created_at.toISOString()
			})
			.select('*')
			.single();
		if (orgRes.error) {
			console.error('Failed to create organization', orgRes.error);
			error(500, orgRes.error.message);
		}

		organizations.push(orgRes.data);
	}

	console.info('Creating users...');
	for (let i = 0; i < 500; i++) {
		const created_at = faker.date.past();
		const sex = faker.person.sexType();
		const firstName = faker.person.firstName(sex);
		const lastName = faker.person.lastName(sex);
		const fullName = faker.person.fullName({
			firstName,
			lastName,
			sex
		});
		const email = faker.internet.email({
			firstName,
			lastName,
			allowSpecialCharacters: false,
			provider: 'gmail.com'
		});
		const avatar = faker.image.avatar();

		const role = faker.helpers.arrayElement(roles);
		const org = faker.helpers.arrayElement(organizations);
		const createUserRes = await supabase.auth.admin.createUser({
			email,
			password: USER_PASSWORD,
			email_confirm: true,
			app_metadata: {
				name: fullName,
				role,
				org,
				avatar
			}
		});
		if (createUserRes.error) {
			console.error('Failed to create user', createUserRes.error);
			error(500, createUserRes.error.message);
		}

		const createProfileRes = await supabase.from('profiles').insert({
			id: createUserRes.data.user.id,
			email,
			name: fullName,
			org_id: org.id,
			role,
			avatar,
			created_at: created_at.toISOString()
		});
		if (createProfileRes.error) {
			console.error('Failed to create user profile', createProfileRes.error);
			error(500, createProfileRes.error.message);
		}

		console.info(`Created user ${i + 1}/${500}`);
	}

	return json({ success: true }, { status: 200 });
}
