// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod core;
mod models;
mod schema;
mod settings;

use crate::core::db::establish_connection;
use settings::get_settings;
use tauri::{CustomMenuItem, SystemTrayMenu};
use tauri::{GlobalShortcutManager, LogicalSize, Manager, RunEvent, SystemTrayEvent};
use tauri_plugin_autostart::MacosLauncher;

use tauri::SystemTray;
use window_shadows::set_shadow;
use window_vibrancy::apply_blur;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct EmptyPayload {}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit);
    let settings = get_settings();

    let tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .manage(establish_connection())
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
            commands::settings::set_key
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

                #[cfg(any(windows, target_os = "macos"))]
                set_shadow(&portal, true).unwrap();

                #[cfg(target_os = "windows")]
                apply_blur(&portal, Some((255, 255, 255, 255)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

                let size = *portal.current_monitor().unwrap().unwrap().size();

                portal
                    .set_size(LogicalSize {
                        width: size.width / 2,
                        height: size.height / 2,
                    })
                    .unwrap();

                portal.center().unwrap();
                ah.global_shortcut_manager()
                    .register(
                        &settings
                            .get_string("portalOpen")
                            .unwrap_or("CmdorCtrl+l".to_string()),
                        move || {
                            let app_handle = ah.clone();
                            let window = app_handle.get_window("portal").unwrap();
                            if window.is_visible().unwrap() {
                                ah.emit_all("portalSwitch", EmptyPayload {}).unwrap();
                                window.hide().unwrap();
                            } else {
                                ah.emit_all("portalSwitch", EmptyPayload {}).unwrap();
                                // window.eval("window.location.reload();").unwrap();
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
