use diesel::prelude::*;
use lancedb::Table;
use tauri::State;

use crate::core::db::DBPool;
use crate::models::{NewSlate, SlateModel};
use ollama_rs::Ollama;

use lancedb::arrow::arrow_schema::{DataType, Field, Schema};
use std::sync::Arc;

use arrow_array::types::Float32Type;
use arrow_array::{FixedSizeListArray, Int32Array, RecordBatch, RecordBatchIterator, StringArray};

#[tauri::command]
pub fn get_slate_data(slate_plane_id: i32, db: State<DBPool>) -> Option<String> {
    use crate::schema::slate::dsl::*;
    let mut conn = db.clone().get().unwrap();

    let result = slate
        .filter(plane_id.eq(slate_plane_id))
        .load::<SlateModel>(&mut conn)
        .unwrap();

    if !result.is_empty() {
        Some(result[0].data.clone())
    } else {
        None
    }
}

#[tauri::command]
pub async fn update_slate_data(
    slate_plane_id: i32,
    new_data: String,
    db: State<'_, DBPool>,
    ollama: State<'_, Ollama>,
    vdb: State<'_, Table>,
) -> Result<(), ()> {
    use crate::schema::{slate, slate::dsl::*};

    let mut conn = db.clone().get().unwrap();

    let new_slate = NewSlate {
        plane_id: slate_plane_id,
        data: new_data.clone(),
    };
    diesel::insert_into(slate::table)
        .values(new_slate)
        .on_conflict(plane_id)
        .do_update()
        .set(data.eq(new_data.clone()))
        .execute(&mut conn)
        .unwrap();

    if new_data.is_empty() {
        vdb.delete(format!("id == {slate_plane_id}").as_str())
            .await
            .unwrap();
        return Ok(());
    }
   

    let emb = ollama
        .generate_embeddings("mxbai-embed-large".to_string(), new_data.clone(), None)
        .await;

    let schema = Arc::new(Schema::new(vec![
        Field::new("id", DataType::Int32, false),
        Field::new(
            "vector",
            DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), 1024),
            true,
        ),
        Field::new("content", DataType::Utf8, true),
    ]));

    if let Ok(emb) = emb {
        vdb.delete(format!("id == {slate_plane_id}").as_str())
            .await
            .unwrap();
        let batches = RecordBatchIterator::new(
            vec![RecordBatch::try_new(
                schema.clone(),
                vec![
                    Arc::new(Int32Array::from(vec![slate_plane_id])),
                    Arc::new(
                        FixedSizeListArray::from_iter_primitive::<Float32Type, _, _>(
                            [Some(emb.embeddings.into_iter().map(|f| Some(f as f32)))],
                            1024,
                        ),
                    ),
                    Arc::new(StringArray::from(vec![Some(new_data)])),
                ],
            )
            .unwrap()]
            .into_iter()
            .map(Ok),
            schema.clone(),
        );
        vdb.add(Box::new(batches)).execute().await.unwrap();
    }

    Ok(())
}
