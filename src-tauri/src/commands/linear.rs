use diesel::prelude::*;
use tauri::State;

use crate::core::db::DBPool;
use crate::models::{LinearModel, NewLinear};

#[tauri::command]
pub fn get_linear_data(linear_plane_id: i32, db: State<DBPool>) -> Option<String> {
    use crate::schema::linear::dsl::*;
    let mut conn = db.clone().get().unwrap();

    let result = linear
        .filter(plane_id.eq(linear_plane_id))
        .load::<LinearModel>(&mut conn)
        .unwrap();

    if !result.is_empty() {
        Some(result[0].data.clone())
    } else {
        None
    }
}

#[tauri::command]
pub fn update_linear_data(linear_plane_id: i32, new_data: String, db: State<DBPool>) {
    use crate::schema::{linear, linear::dsl::*};
    let mut conn = db.clone().get().unwrap();

    let new_linear = NewLinear {
        plane_id: linear_plane_id,
        data: new_data.clone(),
    };
    diesel::insert_into(linear::table)
        .values(new_linear)
        .on_conflict(plane_id)
        .do_update()
        .set(data.eq(new_data))
        .execute(&mut conn)
        .unwrap();
}
