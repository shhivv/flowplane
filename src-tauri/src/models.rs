use crate::schema::{linear, planes, slate};
use diesel::prelude::*;

#[derive(Queryable)]
#[diesel(table_name = planes)]
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

#[derive(Queryable)]
#[diesel(table_name = linear)]
pub struct LinearModel {
    pub id: i32,
    pub plane_id: i32,
    pub data: String,
}

#[derive(Insertable)]
#[diesel(table_name = linear)]
pub struct NewLinear {
    pub plane_id: i32,
    pub data: String,
}


#[derive(Queryable)]
#[diesel(table_name = slate)]
pub struct SlateModel {
    pub id: i32,
    pub plane_id: i32,
    pub data: String,
}

#[derive(Insertable)]
#[diesel(table_name = slate)]
pub struct NewSlate {
    pub plane_id: i32,
    pub data: String,
}