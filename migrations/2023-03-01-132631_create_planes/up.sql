CREATE TABLE planes(
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    plane_type TEXT NOT NULL,
    last_accessed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
