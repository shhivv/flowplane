// @generated automatically by Diesel CLI.

diesel::table! {
    clipboard (id) {
        id -> Integer,
        data -> Text,
        created_at -> Timestamp,
        deleted -> Nullable<Bool>,
    }
}

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

diesel::table! {
    whiteboard (id) {
        id -> Integer,
        plane_id -> Integer,
        document_state -> Text,
        session_state -> Text,
    }
}

diesel::joinable!(linear -> planes (plane_id));
diesel::joinable!(slate -> planes (plane_id));
diesel::joinable!(whiteboard -> planes (plane_id));

diesel::allow_tables_to_appear_in_same_query!(clipboard, linear, planes, slate, whiteboard,);
