// NOTE: Modifying this file needs to be done with care as it is used in the seeding of the database and any changes here will affect the default environments created in the database.Change the migration 20260515184123_backfill_default_environments.sql accordingly if you change the default environments here.
const DEFAULT_ENVIRONMENTS = [
	{
		name: "production",
		is_default: false,
	},
	{
		name: "development",
		is_default: true,
	},
] as const;

export { DEFAULT_ENVIRONMENTS };
