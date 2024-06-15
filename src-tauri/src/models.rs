#[allow(dead_code)]
use crate::schema::{clipboard, linear, planes, slate, whiteboard};
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

#[derive(Queryable)]
#[diesel(table_name = whiteboard)]
pub struct WhiteboardModel {
    pub id: i32,
    pub plane_id: i32,
    pub document_state: String,
    pub session_state: String,
}

#[derive(Insertable)]
#[diesel(table_name = whiteboard)]
pub struct NewWhiteboard {
    pub plane_id: i32,
    pub document_state: String,
    pub session_state: String,
}

#[derive(Queryable)]
#[diesel(table_name = clipboard)]
pub struct ClipboardModel {
    pub id: i32,
    pub data: String,
    pub created_at: chrono::NaiveDateTime,
    pub deleted: Option<bool>,
}

#[derive(Insertable)]
#[diesel(table_name = clipboard)]
pub struct NewClipboard {
    pub data: String,
}
