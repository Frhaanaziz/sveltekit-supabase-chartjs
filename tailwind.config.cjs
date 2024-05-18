const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui'), require('tailwind-scrollbar')],

	daisyui: {
		themes: ['dark', 'light']
	}
};

module.exports = config;
