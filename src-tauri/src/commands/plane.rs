use crate::core::db::DBPool;
use crate::models::{NewPlane, PlaneModel};
use diesel::prelude::*;
use lancedb::Table;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Serialize, Deserialize)]
#[allow(dead_code)]
pub enum PlaneType {
    #[serde(rename = "linear")]
    Linear,
    #[serde(rename = "slate")]
    Slate,
    #[serde(rename = "whiteboard")]
    Whiteboard,
}

#[derive(Serialize, Deserialize)]
pub struct Plane {
    id: i32,
    title: String,
    plane_type: PlaneType,
    last_accessed: i64,
    created_at: i64,
}

impl PlaneType {
    //TODO: fix this
    #[allow(clippy::inherent_to_string)]
    pub fn to_string(&self) -> String {
        match self {
            Self::Linear => "linear",
            Self::Slate => "slate",
            Self::Whiteboard => "whiteboard",
        }
        .to_string()
    }
}

impl From<String> for PlaneType {
    fn from(name: String) -> Self {
        match name.as_str() {
            "linear" => Self::Linear,
            "slate" => Self::Slate,
            _ => Self::Whiteboard,
        }
    }
}

impl From<&PlaneModel> for Plane {
    fn from(planemodel: &PlaneModel) -> Self {
        Plane {
            id: planemodel.id,
            title: planemodel.title.clone(),
            plane_type: PlaneType::from(planemodel.plane_type.clone()),
            last_accessed: planemodel.last_accessed.and_utc().timestamp(),
            created_at: planemodel.created_at.and_utc().timestamp(),
        }
    }
}

#[tauri::command]
pub fn get_planes(db: State<DBPool>) -> Vec<Plane> {
    use crate::schema::planes::dsl::*;

    let mut conn = db.clone().get().unwrap();

    let queried_planes = planes.load(&mut conn).unwrap();

    queried_planes.iter().map(Plane::from).collect::<Vec<_>>()
}

#[tauri::command]
pub fn new_plane(title: String, plane_type: PlaneType, db: State<DBPool>) -> Plane {
    use crate::schema::planes;

    let mut conn = db.clone().get().unwrap();

    let new_plane = NewPlane {
        title,
        plane_type: plane_type.to_string(),
    };

    let inserted = diesel::insert_into(planes::table)
        .values(&new_plane)
        .get_result(&mut conn)
        .unwrap();

    Plane::from(&inserted)
}

#[tauri::command]
pub fn set_last_accessed(plane_id: i32, db: State<DBPool>) {
    use crate::schema::planes::dsl::*;

    let mut conn = db.clone().get().unwrap();

    diesel::update(planes.find(plane_id))
        .set(last_accessed.eq(diesel::dsl::now))
        .execute(&mut conn)
        .unwrap();
}

#[tauri::command]
pub async fn delete_plane(
    plane_id: i32,
    db: State<'_, DBPool>,
    vdb: State<'_, Table>,
) -> Result<(), ()> {
    use crate::schema::planes::dsl::*;

    let _ = vdb.delete(format!("id == {plane_id}").as_str()).await;
    let mut conn = db.clone().get().unwrap();

    diesel::delete(planes.find(plane_id))
        .execute(&mut conn)
        .unwrap();

    Ok(())
}
