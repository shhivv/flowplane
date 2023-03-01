// @generated automatically by Diesel CLI.

diesel::table! {
    planes (id) {
        id -> Nullable<Integer>,
        title -> Nullable<Text>,
        plane_type -> Text,
        last_opened -> Bool,
        created_at -> Timestamp,
    }
}
