#[tauri::command]
pub fn jsdebug(msg: String) {
    println!("{}", msg)
}
