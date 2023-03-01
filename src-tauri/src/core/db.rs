use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use diesel_migrations::{embed_migrations, MigrationHarness, EmbeddedMigrations};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("../migrations");


pub fn establish_connection() -> SqliteConnection{
    let database_url = "";
    let mut conn = SqliteConnection::establish(&database_url).unwrap();

    conn.run_pending_migrations(MIGRATIONS).unwrap();

    conn
}