// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod core;
mod models;
mod schema;

use crate::core::db::establish_connection;
use tauri::{GlobalShortcutManager, LogicalSize, Manager, RunEvent, SystemTrayEvent};
use tauri::{CustomMenuItem, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;

use window_shadows::set_shadow;
use window_vibrancy::apply_blur;
use tauri::SystemTray;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
let tray_menu = SystemTrayMenu::new()
  .add_item(quit);

  let tray = SystemTray::new().with_menu(tray_menu);


    tauri::Builder::default()
        .manage(establish_connection())
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
              event.window().hide().unwrap();
              api.prevent_close();
            }
            _ => {}
          })
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            commands::plane::get_planes,
            commands::plane::new_plane,
            commands::plane::set_last_accessed,
            commands::plane::delete_plane,
            commands::linear::get_linear_data,
            commands::linear::update_linear_data,
            commands::jsdebug::jsdebug
        ])
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
              position: _,
              size: _,
              ..
            } => {       
              app.get_window("main").unwrap().show().unwrap();
            },
            SystemTrayEvent::MenuItemClick {id, ..} => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    },
                    _ => ()
                }
            },
            
            _ => {}
          })
      
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, e| match e {
            RunEvent::Ready => {
                let ah = app_handle.clone();
                let window = app_handle.get_window("portal").unwrap();

                #[cfg(any(windows, target_os = "macos"))]
                set_shadow(&window, true).unwrap();

                #[cfg(target_os = "windows")]
                apply_blur(&window, Some((255, 255, 255, 255)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

                let size = window.current_monitor().unwrap().unwrap().size().clone();

                window
                    .set_size(LogicalSize {
                        width: size.width * 1 / 2,
                        height: size.height * 1 / 2,
                    })
                    .unwrap();

                window.center().unwrap();
                ah.global_shortcut_manager()
                    .register("CmdorCtrl+l", move || {
                        let app_handle = ah.clone();
                        let window = app_handle.get_window("portal").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    })
                    .unwrap();

                let ah = app_handle.clone();
                ah.global_shortcut_manager()
                    .register("Esc", move || {
                        let app_handle = ah.clone();
                        let window = app_handle.get_window("portal").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        }
                    })
                    .unwrap();
            },
            _ => (),
        });
}
