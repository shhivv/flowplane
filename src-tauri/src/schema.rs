// @generated automatically by Diesel CLI.

diesel::table! {
    linear (id) {
        id -> Integer,
        plane_id -> Integer,
        data -> Text,
    }
}

diesel::table! {
    planes (id) {
        id -> Integer,
        title -> Text,
        plane_type -> Text,
        last_accessed -> Timestamp,
        created_at -> Timestamp,
    }
}

diesel::table! {
    slate (id) {
        id -> Integer,
        plane_id -> Integer,
        data -> Text,
    }
}

diesel::joinable!(linear -> planes (plane_id));
diesel::joinable!(slate -> planes (plane_id));

diesel::allow_tables_to_appear_in_same_query!(linear, planes, slate,);
