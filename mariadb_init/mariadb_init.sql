-- SCANNER TABLE
CREATE TABLE IF NOT EXISTS scanner (
    scanner_id INT AUTO_INCREMENT PRIMARY KEY,
    scanner_name VARCHAR(255) NOT NULL
);

-- MATERIAL EVENT TABLE (ONLY 'Material Added')
CREATE TABLE IF NOT EXISTS material_event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    scanner_id INT NOT NULL,
    product_id INT NOT NULL,
    material_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL DEFAULT 'Material Added',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scanner_id) REFERENCES scanner(scanner_id)
);

-- SAMPLE SCANNERS
INSERT INTO scanner (scanner_name)
SELECT 'Scanner A' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM scanner WHERE scanner_name = 'Scanner A');

INSERT INTO scanner (scanner_name)
SELECT 'Scanner B' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM scanner WHERE scanner_name = 'Scanner B');

-- SAMPLE MATERIAL EVENTS (ALL Material Added)
INSERT INTO material_event (scanner_id, product_id, material_id, event_type)
VALUES
    (1, 1, 1, 'Material Added'),
    (1, 1, 1, 'Material Added'),
    (2, 1, 1, 'Material Added');
