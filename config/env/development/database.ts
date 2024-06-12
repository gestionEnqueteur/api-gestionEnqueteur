export default ({ env }) => ({
	connection: {
		client: env('DATABASE_CLIENT', 'mysql'),
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 3306),
			database: env('DATABASE_NAME', 'strapi'),
			user: env('DATABASE_USERNAME', 'strapi'),
			password: env('DATABASE_PASSWORD', 'passwordStrapi'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
