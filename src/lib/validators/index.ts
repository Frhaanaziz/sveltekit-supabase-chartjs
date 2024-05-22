import { z } from 'zod';

const FILE_SIZE_1MB = 1024 * 1024;
export const fileSchema = z
	.instanceof(File, { message: 'Please upload a file' })
	.refine((file) => file.size < FILE_SIZE_1MB, {
		message: 'File size must be less than 1MB'
	})
	.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
		message: 'File must be a JPEG, JPG or PNG image'
	});
