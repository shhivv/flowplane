use serde::Serialize;

#[derive(Serialize)]
#[allow(dead_code)]
enum PlaneType{
    Linear,
    FreeFlow
}

#[derive(Serialize)]
pub struct Plane{
    title: String,
    plane_type: PlaneType,
    last_opened: bool
}

#[tauri::command]
pub fn get_planes() -> Vec<Plane> {
    vec![Plane{
        title: "Welcome".to_string(),
        plane_type: PlaneType::Linear,
        last_opened: true
    }]
}

#[tauri::command]
pub fn new_plane(){}