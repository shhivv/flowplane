use diesel::prelude::*;
use tauri::State;

use crate::core::db::DBPool;
use crate::models::{NewSlate, SlateModel};
use ollama_rs::Ollama;

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
pub async fn update_slate_data(slate_plane_id: i32, new_data: String, db: State<'_, DBPool>,  ollama: State<'_, Ollama>) -> Result<(),()> {
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

    let _res = ollama.generate_embeddings("mxbai-embed-large".to_string(), new_data, None).await;
    Ok(())
}
