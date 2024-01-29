use std::{fs, path::PathBuf};

use directories::BaseDirs;
use serde_json::Value;

// idk if this is the result of laziness
#[tauri::command]
pub fn get_config() -> String {
    let binding = BaseDirs::new().unwrap();
    let mut app_dir = PathBuf::from(binding.config_dir());

    app_dir.push(".flowplane");
    app_dir.push("config.json");
    fs::read_to_string(app_dir).unwrap()
}

#[tauri::command]
pub fn set_key(key: &str, value: String) {
    let binding = BaseDirs::new().unwrap();
    let mut app_dir = PathBuf::from(binding.config_dir());

    app_dir.push(".flowplane");
    app_dir.push("config.json");
    let config = fs::read_to_string(&app_dir).unwrap();
    let mut v: Value = serde_json::from_str(&config).unwrap();
    v[key] = Value::String(value);
    fs::write(app_dir, v.to_string()).unwrap();
}
