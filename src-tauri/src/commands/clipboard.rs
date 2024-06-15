use crate::core::db::DBPool;
use crate::models::{ClipboardModel, NewClipboard};
use diesel::prelude::*;
use tauri::State;

#[tauri::command]
pub fn get_clipboard_data(db: State<DBPool>) -> Vec<String> {
    use crate::schema::clipboard::dsl::*;
    let mut conn = db.clone().get().unwrap();

    let result = clipboard
        .limit(1000)
        .load::<ClipboardModel>(&mut conn)
        .unwrap();
    return result.iter().map(|f| f.data.clone()).collect::<Vec<_>>();
}

pub fn push_to_clipboard(db: DBPool, new_data: String) {
    use crate::schema::clipboard;
    let mut conn = db.clone().get().unwrap();
    let new_clip = NewClipboard { data: new_data };
    diesel::insert_into(clipboard::table)
        .values(new_clip)
        .execute(&mut conn)
        .unwrap();
}
