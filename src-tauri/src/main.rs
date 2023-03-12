// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod core;
mod models;
mod schema;

use crate::core::db::establish_connection;

fn main() {
    tauri::Builder::default()
        .manage(establish_connection())
        .invoke_handler(tauri::generate_handler![
            commands::plane::get_planes,
            commands::plane::new_plane,
            commands::plane::set_last_accessed,
            commands::plane::delete_plane,
            commands::linear::get_linear_data,
            commands::linear::update_linear_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
