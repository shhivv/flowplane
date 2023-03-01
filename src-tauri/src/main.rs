// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod plane;
mod core;

use crate::core::db::establish_connection;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![plane::get_planes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
