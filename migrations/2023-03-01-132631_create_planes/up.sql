CREATE TABLE planes(
    id INTEGER PRIMARY KEY,
    title TEXT,
    plane_type TEXT NOT NULL,
    last_opened BOOLEAN NOT NULL DEFAULT false,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
