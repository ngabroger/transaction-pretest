CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS stock (
    product_id INTEGER PRIMARY KEY,
    quantity INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active | cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

INSERT INTO
    products (name, price)
VALUES ('iPhone 16 Pro Max', 21999000),
    ('iPhone 16 Pro', 18999000),
    ('iPhone 16', 14999000),
    ('iPhone 15 Pro Max', 17999000),
    ('iPhone 15 Pro', 15999000),
    ('iPhone 15', 12999000),
    ('iPhone 14 Pro Max', 14999000),
    ('iPhone 14 Pro', 12999000),
    ('iPhone 14', 10999000),
    ('iPhone 13', 8999000);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (1, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (2, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (3, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (4, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (5, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (6, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (7, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (8, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (9, 10);

INSERT OR IGNORE INTO stock (product_id, quantity) VALUES (10, 10);