// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(dead_code)]

mod commands;
mod core;
mod models;
mod schema;
mod settings;

use crate::core::db::establish_connection;
use settings::get_settings;
use tauri::{CustomMenuItem, PhysicalSize, SystemTrayMenu};
use tauri::{GlobalShortcutManager, Manager, RunEvent, SystemTrayEvent};
use tauri_plugin_autostart::MacosLauncher;

use tauri::SystemTray;
use window_shadows::set_shadow;
// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct EmptyPayload {}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    #[cfg(not(debug_assertions))]
    let _guard = sentry::init(("https://fdca118f39b5ea0bbd47e967a021dcec@o4506677404762112.ingest.sentry.io/4506677439692800", sentry::ClientOptions {
        release: sentry::release_name!(),
        ..Default::default()
      }));
    let db = establish_connection();
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit);
    let settings = get_settings();

    let tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .manage(db)
        .on_window_event(|event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                event.window().hide().unwrap();
                if event.window().label() == "portal" {
                    event
                        .window()
                        .app_handle()
                        .emit_all("portalSwitch", EmptyPayload {})
                        .unwrap();
                }
                api.prevent_close();
            }
        })
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let window = app.get_window("main").unwrap();
            // window.eval("window.location.reload();").unwrap();
            window.show().unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            commands::plane::get_planes,
            commands::plane::new_plane,
            commands::plane::set_last_accessed,
            commands::plane::delete_plane,
            commands::linear::get_linear_data,
            commands::linear::update_linear_data,
            commands::jsdebug::jsdebug,
            commands::slate::get_slate_data,
            commands::slate::update_slate_data,
            commands::settings::get_config,
            commands::settings::set_key,
            commands::whiteboard::get_whiteboard_data,
            commands::whiteboard::update_whiteboard_data,
            commands::clipboard::get_clipboard_data,
            commands::page_markdown::get_markdown
        ])
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                app.get_window("main").unwrap().show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                if id.as_str() == "quit" {
                    std::process::exit(0);
                }
            }

            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(move |app_handle, e| {
            if let RunEvent::Ready = e {
                let ah = app_handle.clone();
                let portal = app_handle.get_window("portal").unwrap();
                let main = app_handle.get_window("main").unwrap();

                #[cfg(any(windows, target_os = "macos"))]
                set_shadow(&portal, true).unwrap();
                set_shadow(&main, true).unwrap();

                let size = *portal.current_monitor().unwrap().unwrap().size();

                portal
                    .set_size(PhysicalSize {
                        width: (size.width as f32 * 0.8) as u32,
                        height: (size.height as f32 * 0.8) as u32,
                    })
                    .unwrap();
                portal.center().unwrap();
                ah.global_shortcut_manager()
                    .register(
                        &settings
                            .get_string("portalOpen")
                            .unwrap_or("Alt+W".to_string()),
                        move || {
                            let app_handle = ah.clone();
                            let window = app_handle.get_window("portal").unwrap();
                            if window.is_visible().unwrap() {
                                ah.emit_all("portalSwitch", EmptyPayload {}).unwrap();
                                window.hide().unwrap();
                            } else {
                                ah.emit_all("portalSwitch", EmptyPayload {}).unwrap();
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                        },
                    )
                    .unwrap();

                let ah = app_handle.clone();
                ah.global_shortcut_manager()
                    .register("Esc", move || {
                        let app_handle = ah.clone();
                        let window = app_handle.get_window("portal").unwrap();
                        if window.is_visible().unwrap() {
                            ah.emit_all("portalSwitch", EmptyPayload {}).unwrap();
                            window.hide().unwrap();
                        }
                    })
                    .unwrap();
            }
        });
}
