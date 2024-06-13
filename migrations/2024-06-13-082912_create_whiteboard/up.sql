CREATE TABLE whiteboard(
    id INTEGER PRIMARY KEY NOT NULL,
    plane_id INTEGER NOT NULL UNIQUE,
    document_state TEXT NOT NULL,
    session_state TEXT NOT NULL,
    FOREIGN KEY (plane_id) REFERENCES planes(id) ON DELETE CASCADE
)
