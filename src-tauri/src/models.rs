use crate::schema::planes;
use diesel::prelude::*;

#[derive(Queryable)]
pub struct PlaneModel {
    pub id: i32,
    pub title: String,
    pub plane_type: String,
    pub last_accessed: chrono::NaiveDateTime,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = planes)]
pub struct NewPlane {
    pub title: String,
    pub plane_type: String,
}
