use std::fs;
use std::path::PathBuf;

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use directories::BaseDirs;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("../migrations");

pub type DBPool = Pool<ConnectionManager<SqliteConnection>>;

pub fn establish_connection() -> DBPool {
    let binding = BaseDirs::new().unwrap();
    let mut app_dir = PathBuf::from(binding.data_dir());

    app_dir.push(".flowplane");

    if !app_dir.exists() {
        fs::create_dir(&app_dir).expect("failed to create directory");
    }

    let db = app_dir.join("data.sqlite");
    if !db.exists() {
        fs::copy("./default.sqlite", &db).unwrap();
    }

    let database_url = db.into_os_string().into_string().unwrap();
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    let pool = Pool::builder()
        .build(manager)
        .expect("Failed to create pool");

    pool.get()
        .unwrap()
        .run_pending_migrations(MIGRATIONS)
        .unwrap();

    pool
}
