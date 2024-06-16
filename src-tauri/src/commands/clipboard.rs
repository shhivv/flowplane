use crate::commands::page_markdown;
use crate::core::db::DBPool;
use crate::models::{ClipboardModel, NewClipboard};
use crate::settings::get_settings;
use diesel::prelude::*;
use tauri::State;

#[tauri::command]
pub fn get_clipboard_data(db: State<DBPool>) -> Vec<String> {
    let settings = get_settings();

    if let Ok(enabled) = settings.get_string("enableClipboard") {
        if enabled == "false" {
            return vec![];
        }
    };
    use crate::schema::clipboard::dsl::*;
    let mut conn = db.clone().get().unwrap();

    let result = clipboard
        .order(id.desc())
        .limit(100)
        .load::<ClipboardModel>(&mut conn)
        .unwrap();
    return result.iter().map(|f| f.data.clone()).collect::<Vec<_>>();
}

#[tauri::command]
pub async fn push_to_clipboard(new_data: String, db: State<'_, DBPool>) -> Result<(), ()> {
    let settings = get_settings();

    if let Ok(enabled) = settings.get_string("enableClipboard") {
        if enabled == "false" {
            return Ok(());
        };
    };

    use crate::schema::clipboard;
    let mut conn = db.clone().get().unwrap();
    let mut markdown = None;
    if is_url::is_url(&new_data) {
        let content = page_markdown::_get_markdown(new_data.clone()).await;
        if let Some(_) = content {
            markdown = content;
        }
    }
    let new_clip = NewClipboard { data: new_data };
    diesel::insert_into(clipboard::table)
        .values(new_clip)
        .execute(&mut conn)
        .unwrap();

    if let Some(md) = markdown {
        diesel::insert_into(clipboard::table)
            .values(NewClipboard { data: md })
            .execute(&mut conn)
            .unwrap();
    };
    Ok(())
}
