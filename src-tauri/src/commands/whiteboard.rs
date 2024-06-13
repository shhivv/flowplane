use diesel::prelude::*;
use tauri::State;

use crate::core::db::DBPool;
use crate::models::{NewWhiteboard, WhiteboardModel};

#[tauri::command]
pub fn get_whiteboard_data(
    whiteboard_plane_id: i32,
    db: State<DBPool>,
) -> Option<(String, String)> {
    use crate::schema::whiteboard::dsl::*;
    let mut conn = db.clone().get().unwrap();

    let result = whiteboard
        .filter(plane_id.eq(whiteboard_plane_id))
        .load::<WhiteboardModel>(&mut conn)
        .unwrap();

    if !result.is_empty() {
        Some((
            result[0].document_state.clone(),
            result[0].session_state.clone(),
        ))
    } else {
        None
    }
}

#[tauri::command]
pub fn update_whiteboard_data(
    whiteboard_plane_id: i32,
    doc_state: String,
    sesh_state: String,
    db: State<DBPool>,
) {
    use crate::schema::{whiteboard, whiteboard::dsl::*};
    let mut conn = db.clone().get().unwrap();

    let new_whiteboard = NewWhiteboard {
        plane_id: whiteboard_plane_id,
        document_state: doc_state.clone(),
        session_state: sesh_state.clone(),
    };
    diesel::insert_into(whiteboard::table)
        .values(new_whiteboard)
        .on_conflict(plane_id)
        .do_update()
        .set((document_state.eq(doc_state), session_state.eq(sesh_state)))
        .execute(&mut conn)
        .unwrap();
}
