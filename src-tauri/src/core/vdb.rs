use std::sync::Arc;

use lancedb::arrow::arrow_schema::{DataType, Field, Schema};

use directories::BaseDirs;
use lancedb::connection::Connection;
use lancedb::{connect, Result, Table as LanceDbTable};
use std::fs;
use std::path::PathBuf;

pub async fn establish_connection() -> LanceDbTable {
    let binding = BaseDirs::new().unwrap();
    let mut app_dir = PathBuf::from(binding.data_dir());

    app_dir.push(".flowplane");

    if !app_dir.exists() {
        fs::create_dir(&app_dir).expect("failed to create directory");
    }

    app_dir.push("embeddings");

    let db = connect(app_dir.to_str().unwrap()).execute().await.unwrap();
    let exists = db.open_table("embeddings").execute().await;
    if exists.is_err() {
        create_empty_table(&db).await.unwrap();
    }

    db.open_table("embeddings").execute().await.unwrap()
}

async fn create_empty_table(db: &Connection) -> Result<LanceDbTable> {
    let schema = Arc::new(Schema::new(vec![
        Field::new("id", DataType::Int32, false),
        Field::new(
            "vector",
            DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), 1024),
            true,
        ),
        Field::new("content", DataType::Utf8, true),
    ]));
    db.create_empty_table("embeddings", schema).execute().await
}
