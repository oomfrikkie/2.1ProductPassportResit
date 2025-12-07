-- FACTORY TABLE
CREATE TABLE IF NOT EXISTS factory (
    factory_id SERIAL PRIMARY KEY,
    factory_name VARCHAR(255) NOT NULL
);

-- MACHINE TABLE
CREATE TABLE IF NOT EXISTS machine (
    machine_id SERIAL PRIMARY KEY,
    machine_name VARCHAR(255) NOT NULL,
    factory_id INTEGER NOT NULL REFERENCES factory(factory_id) ON DELETE CASCADE
);

-- MATERIAL TABLE
CREATE TABLE IF NOT EXISTS material (
    material_id SERIAL PRIMARY KEY,
    material_name VARCHAR(255) NOT NULL
);

-- PRODUCT TABLE
CREATE TABLE IF NOT EXISTS product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL
);

-- PRODUCT-MATERIAL RELATION TABLE
CREATE TABLE IF NOT EXISTS product_material (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES material(material_id) ON DELETE CASCADE
);

-- SAMPLE DATA

INSERT INTO factory (factory_name) VALUES ('Factory A') ON CONFLICT DO NOTHING;

INSERT INTO machine (machine_name, factory_id)
SELECT 'Mixer', 1 WHERE NOT EXISTS (SELECT 1 FROM machine WHERE machine_name = 'Mixer');

INSERT INTO material (material_name)
SELECT 'Plastic' WHERE NOT EXISTS (SELECT 1 FROM material WHERE material_name = 'Plastic');

INSERT INTO product (product_name)
SELECT 'Bottle' WHERE NOT EXISTS (SELECT 1 FROM product WHERE product_name = 'Bottle');

INSERT INTO product_material (product_id, material_id)
SELECT 1, 1
WHERE NOT EXISTS (SELECT 1 FROM product_material WHERE product_id = 1 AND material_id = 1);
