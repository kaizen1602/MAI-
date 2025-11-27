-- =====================================================
-- DATOS SIMULADOS (MOCK) - Precios de Mercado Corabastos
-- =====================================================
--
-- Este script inserta datos de precios SIMULADOS para probar
-- el módulo de recomendaciones SIN necesidad de n8n activo.
--
-- Simula 30 días de datos de mercado para ~50 productos
-- con variaciones realistas de precio.
--
-- IMPORTANTE: Estos son datos FICTICIOS para MVP/Testing
-- =====================================================

-- Limpiar datos existentes de prueba (opcional)
-- DELETE FROM market_prices WHERE source = 'MOCK_DATA';
-- DELETE FROM price_trends WHERE product_catalog_id IN (SELECT id FROM products_catalog);

-- =====================================================
-- FUNCIÓN AUXILIAR: Generar precios con variación
-- =====================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS generate_mock_prices$$

CREATE PROCEDURE generate_mock_prices()
BEGIN
    DECLARE v_date DATE;
    DECLARE v_days INT DEFAULT 30;
    DECLARE v_day_counter INT DEFAULT 0;

    -- Productos más comunes con precios base realistas (COP por kg)
    DECLARE v_products CURSOR FOR
        SELECT id, name FROM products_catalog WHERE is_active = 1 LIMIT 50;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_day_counter = v_days;

    -- Generar precios para los últimos 30 días
    WHILE v_day_counter < v_days DO
        SET v_date = DATE_SUB(CURDATE(), INTERVAL v_day_counter DAY);

        -- FRUTAS
        -- Aguacate Hass (precio base: 6500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'AGUACATE HASS' LIMIT 1),
            1, -- KILO
            1,
            6800 + FLOOR(RAND() * 1000),
            6500 + FLOOR(RAND() * 800),
            6200 + FLOOR(RAND() * 600),
            CASE WHEN RAND() > 0.6 THEN 'Subio' WHEN RAND() > 0.3 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Aguacate Hass',
            0.98,
            NOW(),
            NOW()
        );

        -- Banano (precio base: 2000)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'BANANO' LIMIT 1),
            1, -- KILO
            1,
            NULL,
            2100 + FLOOR(RAND() * 300),
            1900 + FLOOR(RAND() * 200),
            CASE WHEN RAND() > 0.7 THEN 'Subio' WHEN RAND() > 0.4 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Banano',
            0.95,
            NOW(),
            NOW()
        );

        -- Mango Tommy (precio base: 3500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'MANGO TOMMY' LIMIT 1),
            1, -- KILO
            1,
            3800 + FLOOR(RAND() * 500),
            3500 + FLOOR(RAND() * 400),
            3200 + FLOOR(RAND() * 300),
            CASE WHEN RAND() > 0.5 THEN 'Subio' WHEN RAND() > 0.3 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Mango Tommy',
            0.92,
            NOW(),
            NOW()
        );

        -- Naranja (precio base: 2500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'NARANJA' LIMIT 1),
            1, -- KILO
            1,
            2700 + FLOOR(RAND() * 400),
            2500 + FLOOR(RAND() * 300),
            2300 + FLOOR(RAND() * 200),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Naranja',
            0.97,
            NOW(),
            NOW()
        );

        -- TUBÉRCULOS
        -- Papa Criolla Lavada (precio base: 4500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'PAPA CRIOLLA' LIMIT 1),
            1, -- KILO
            1,
            4800 + FLOOR(RAND() * 600),
            4500 + FLOOR(RAND() * 500),
            4300 + FLOOR(RAND() * 400),
            CASE WHEN RAND() > 0.6 THEN 'Subio' WHEN RAND() > 0.3 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Papa Criolla (Lavada)',
            0.95,
            NOW(),
            NOW()
        );

        -- Papa Pastusa (precio base: 2800)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'PAPA PASTUSA' LIMIT 1),
            1, -- KILO
            1,
            3000 + FLOOR(RAND() * 400),
            2800 + FLOOR(RAND() * 300),
            2600 + FLOOR(RAND() * 200),
            CASE WHEN RAND() > 0.5 THEN 'Subio' WHEN RAND() > 0.4 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Papa Pastusa',
            0.94,
            NOW(),
            NOW()
        );

        -- Yuca (precio base: 1800)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'YUCA' LIMIT 1),
            1, -- KILO
            1,
            NULL,
            1900 + FLOOR(RAND() * 250),
            1700 + FLOOR(RAND() * 200),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Yuca',
            0.96,
            NOW(),
            NOW()
        );

        -- HORTALIZAS
        -- Tomate Chonto (precio base: 3200, VOLÁTIL)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'TOMATE CHONTO' LIMIT 1),
            1, -- KILO
            1,
            3800 + FLOOR(RAND() * 1200),
            3400 + FLOOR(RAND() * 1000),
            3000 + FLOOR(RAND() * 800),
            CASE WHEN RAND() > 0.5 THEN 'Subio' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Tomate Chonto',
            0.93,
            NOW(),
            NOW()
        );

        -- Cebolla Cabezona (precio base: 2500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'CEBOLLA CABEZONA' LIMIT 1),
            1, -- KILO
            1,
            2700 + FLOOR(RAND() * 400),
            2500 + FLOOR(RAND() * 300),
            2300 + FLOOR(RAND() * 250),
            CASE WHEN RAND() > 0.6 THEN 'Subio' WHEN RAND() > 0.3 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Cebolla Cabezona',
            0.91,
            NOW(),
            NOW()
        );

        -- Zanahoria (precio base: 2000)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'ZANAHORIA' LIMIT 1),
            1, -- KILO
            1,
            2200 + FLOOR(RAND() * 300),
            2000 + FLOOR(RAND() * 250),
            1850 + FLOOR(RAND() * 200),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Zanahoria',
            0.94,
            NOW(),
            NOW()
        );

        -- Lechuga (precio base: 1500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'LECHUGA' LIMIT 1),
            2, -- UNIDAD
            1,
            NULL,
            1600 + FLOOR(RAND() * 200),
            1400 + FLOOR(RAND() * 150),
            CASE WHEN RAND() > 0.7 THEN 'Subio' WHEN RAND() > 0.4 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Lechuga',
            0.88,
            NOW(),
            NOW()
        );

        -- PLÁTANOS
        -- Plátano Hartón (precio base: 2200)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'PLATANO HARTON' LIMIT 1),
            1, -- KILO
            1,
            2400 + FLOOR(RAND() * 350),
            2200 + FLOOR(RAND() * 300),
            2000 + FLOOR(RAND() * 250),
            CASE WHEN RAND() > 0.5 THEN 'Subio' WHEN RAND() > 0.3 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Plátano Hartón',
            0.92,
            NOW(),
            NOW()
        );

        -- GRANOS
        -- Frijol (precio base: 7500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'FRIJOL' LIMIT 1),
            1, -- KILO
            1,
            8000 + FLOOR(RAND() * 600),
            7500 + FLOOR(RAND() * 500),
            7200 + FLOOR(RAND() * 400),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Frijol',
            0.90,
            NOW(),
            NOW()
        );

        -- Arroz (precio base: 3500)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'ARROZ' LIMIT 1),
            1, -- KILO
            1,
            3700 + FLOOR(RAND() * 300),
            3500 + FLOOR(RAND() * 250),
            3300 + FLOOR(RAND() * 200),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Arroz',
            0.95,
            NOW(),
            NOW()
        );

        -- HUEVOS
        -- Huevo AA (precio base: 800 por unidad)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'HUEVO' LIMIT 1),
            2, -- UNIDAD
            1,
            850 + FLOOR(RAND() * 100),
            800 + FLOOR(RAND() * 80),
            750 + FLOOR(RAND() * 60),
            CASE WHEN RAND() > 0.6 THEN 'Subio' WHEN RAND() > 0.4 THEN 'Estable' ELSE 'Bajo' END,
            v_date,
            'MOCK_DATA',
            'Huevo AA',
            0.93,
            NOW(),
            NOW()
        );

        -- LÁCTEOS
        -- Leche (precio base: 1800 por litro)
        INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_extra, price_first, price_unit, price_variation, date, source, raw_name, extraction_confidence, created_at, updated_at)
        VALUES (
            (SELECT id FROM products_catalog WHERE name = 'LECHE' LIMIT 1),
            28, -- LITRO
            1,
            NULL,
            1900 + FLOOR(RAND() * 200),
            1750 + FLOOR(RAND() * 150),
            'Estable',
            v_date,
            'MOCK_DATA',
            'Leche',
            0.97,
            NOW(),
            NOW()
        );

        SET v_day_counter = v_day_counter + 1;
    END WHILE;

END$$

DELIMITER ;

-- =====================================================
-- EJECUTAR GENERACIÓN DE DATOS MOCK
-- =====================================================

CALL generate_mock_prices();

-- =====================================================
-- CALCULAR TENDENCIAS AUTOMÁTICAMENTE
-- =====================================================

-- Calcular tendencias para los productos con datos mock
INSERT INTO price_trends (
    product_catalog_id,
    period_start,
    period_end,
    avg_price,
    min_price,
    max_price,
    price_volatility,
    trend_direction,
    price_change_percentage,
    data_points,
    created_at,
    updated_at
)
SELECT
    mp.product_catalog_id,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY) as period_start,
    CURDATE() as period_end,
    AVG(mp.price_unit) as avg_price,
    MIN(mp.price_unit) as min_price,
    MAX(mp.price_unit) as max_price,
    STDDEV(mp.price_unit) as price_volatility,
    CASE
        WHEN (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = mp.product_catalog_id
            AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ) > (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = mp.product_catalog_id
            AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ) * 1.05 THEN 'UP'
        WHEN (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = mp.product_catalog_id
            AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ) < (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = mp.product_catalog_id
            AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ) * 0.95 THEN 'DOWN'
        ELSE 'STABLE'
    END as trend_direction,
    CASE
        WHEN (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = mp.product_catalog_id
            AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ) > 0 THEN
            ((
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = mp.product_catalog_id
                AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ) - (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = mp.product_catalog_id
                AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                AND date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            )) / (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = mp.product_catalog_id
                AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                AND date < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ) * 100
        ELSE 0
    END as price_change_percentage,
    COUNT(*) as data_points,
    NOW() as created_at,
    NOW() as updated_at
FROM market_prices mp
WHERE mp.source = 'MOCK_DATA'
AND mp.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY mp.product_catalog_id
ON DUPLICATE KEY UPDATE
    avg_price = VALUES(avg_price),
    min_price = VALUES(min_price),
    max_price = VALUES(max_price),
    price_volatility = VALUES(price_volatility),
    trend_direction = VALUES(trend_direction),
    price_change_percentage = VALUES(price_change_percentage),
    data_points = VALUES(data_points),
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver resumen de datos insertados
SELECT
    pc.category,
    COUNT(DISTINCT mp.product_catalog_id) as productos,
    COUNT(*) as registros_precios,
    AVG(mp.price_unit) as precio_promedio,
    MIN(mp.date) as desde,
    MAX(mp.date) as hasta
FROM market_prices mp
JOIN products_catalog pc ON mp.product_catalog_id = pc.id
WHERE mp.source = 'MOCK_DATA'
GROUP BY pc.category
ORDER BY pc.category;

-- Ver productos con tendencias calculadas
SELECT
    pc.name as producto,
    pt.trend_direction as tendencia,
    pt.avg_price as precio_promedio,
    pt.price_change_percentage as cambio_porcentual,
    pt.price_volatility as volatilidad,
    pt.data_points as puntos_datos
FROM price_trends pt
JOIN products_catalog pc ON pt.product_catalog_id = pc.id
WHERE pt.period_end = CURDATE()
ORDER BY pc.name;

-- =====================================================
-- LIMPIAR PROCEDIMIENTO (OPCIONAL)
-- =====================================================

-- DROP PROCEDURE IF EXISTS generate_mock_prices;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT '✅ Datos MOCK insertados correctamente!' as status,
       (SELECT COUNT(*) FROM market_prices WHERE source = 'MOCK_DATA') as total_precios,
       (SELECT COUNT(DISTINCT product_catalog_id) FROM market_prices WHERE source = 'MOCK_DATA') as productos_con_precios,
       (SELECT COUNT(*) FROM price_trends WHERE period_end = CURDATE()) as tendencias_calculadas;
