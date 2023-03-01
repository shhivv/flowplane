use serde::Serialize;

#[derive(Serialize)]
#[allow(dead_code)]
enum PlaneType{
    #[serde(rename = "linear")]
    Linear,
    #[serde(rename = "freeflow")]
    FreeFlow
}

#[derive(Serialize)]
pub struct Plane{
    id: u64,
    title: String,
    plane_type: PlaneType,
    last_opened: bool
}

#[tauri::command]
pub fn get_planes() -> Vec<Plane> {
    vec![Plane{
        id: 0,
        title: "Welcome".to_string(),
        plane_type: PlaneType::Linear,
        last_opened: true
    }, Plane{
        id: 1,
        title: "Explore".to_string(),
        plane_type: PlaneType::FreeFlow,
        last_opened: true
    }]
}

#[tauri::command]
pub fn new_plane(){}