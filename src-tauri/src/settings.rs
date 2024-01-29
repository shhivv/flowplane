use std::{fs, path::PathBuf};

use config::Config;
use directories::BaseDirs;

const BASE: &str = r#"{
  "portalOpen": "CmdorCtrl+q"
}"#;

pub fn get_settings() -> Config {
    let binding = BaseDirs::new().unwrap();
    let mut app_dir = PathBuf::from(binding.config_dir());

    app_dir.push(".flowplane");

    if !app_dir.exists() {
        fs::create_dir(&app_dir).expect("failed to create directory");
    }

    let file = app_dir.join("config.json");
    if !file.exists() {
        fs::File::create(&file).unwrap();
        fs::write(&file, BASE).unwrap();
    }

    let file_url = file.into_os_string().into_string().unwrap();

    Config::builder()
        .add_source(config::File::with_name(&file_url))
        .build()
        .unwrap()
}
