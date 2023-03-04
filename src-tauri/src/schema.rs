// @generated automatically by Diesel CLI.

diesel::table! {
    planes (id) {
        id -> Integer,
        title -> Text,
        plane_type -> Text,
        last_accessed -> Timestamp,
        created_at -> Timestamp,
    }
}
