-- =====================================================
-- MAI INTELLIGENCE MODULE - DATABASE MIGRATION
-- Fecha: 2025-11-26
-- Descripción: Extensión de BD para sistema de precios inteligentes
-- Autor: Claude Code (Autonomous)
-- =====================================================

USE `mai_db`;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- =====================================================
-- TABLA: products_catalog
-- Catálogo estandarizado de productos agrícolas
-- =====================================================
CREATE TABLE IF NOT EXISTS `products_catalog` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL COMMENT 'Nombre estándar del producto',
  `category` VARCHAR(100) NULL COMMENT 'Categoría: Pollo, Pescado, Frutas, Hortalizas, etc.',
  `aliases` JSON NULL COMMENT 'JSON con nombres alternativos para normalización',
  `description` VARCHAR(500) NULL COMMENT 'Descripción del producto',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT 'Producto activo en el sistema',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_name` (`name`),
  INDEX `idx_active` (`is_active`),
  FULLTEXT INDEX `ft_name_description` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo normalizado de productos agrícolas';

-- =====================================================
-- TABLA: measurement_units
-- Unidades de medida estandarizadas
-- =====================================================
CREATE TABLE IF NOT EXISTS `measurement_units` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unit_name` VARCHAR(50) NOT NULL COMMENT 'KILO, BULTO, CAJA, ATADO, etc.',
  `unit_type` ENUM('weight', 'volume', 'count', 'other') DEFAULT 'other' COMMENT 'Tipo de unidad',
  `kg_equivalent` DECIMAL(10,4) NULL COMMENT 'Equivalencia en kilogramos (si aplica)',
  `description` VARCHAR(200) NULL COMMENT 'Descripción de la unidad',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_unit_name` (`unit_name`),
  INDEX `idx_unit_type` (`unit_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Unidades de medida estandarizadas';

-- =====================================================
-- TABLA: product_variations
-- Variaciones de productos (lavada, sucia, roja, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS `product_variations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_catalog_id` INT NOT NULL,
  `variation_name` VARCHAR(100) NOT NULL COMMENT 'LAVADA, SUCIA, ROJA, BLANCA, etc.',
  `price_modifier` DECIMAL(5,2) DEFAULT 1.00 COMMENT 'Multiplicador de precio (1.0 = sin cambio)',
  `description` VARCHAR(300) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_catalog_id`)
    REFERENCES `products_catalog`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX `idx_product_variation` (`product_catalog_id`, `variation_name`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Variaciones de productos para normalización';

-- =====================================================
-- TABLA: market_prices
-- Precios históricos de Corabastos (datos extraídos)
-- =====================================================
CREATE TABLE IF NOT EXISTS `market_prices` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_catalog_id` INT NOT NULL COMMENT 'Referencia al catálogo normalizado',
  `product_variation_id` INT NULL COMMENT 'Variación del producto (si aplica)',
  `measurement_unit_id` INT NOT NULL COMMENT 'Unidad de medida',
  `quantity` DECIMAL(10,2) NOT NULL COMMENT 'Cantidad en la presentación',
  `price_extra` DECIMAL(12,2) NULL COMMENT 'Precio calidad extra (COP)',
  `price_first` DECIMAL(12,2) NULL COMMENT 'Precio calidad primera (COP)',
  `price_unit` DECIMAL(12,2) NOT NULL COMMENT 'Precio por unidad (COP)',
  `price_variation` ENUM('Estable', 'Bajo', 'Subio') DEFAULT 'Estable' COMMENT 'Variación vs día anterior',
  `date` DATE NOT NULL COMMENT 'Fecha del boletín',
  `source` VARCHAR(100) DEFAULT 'Corabastos' COMMENT 'Fuente del dato',
  `raw_name` VARCHAR(200) NULL COMMENT 'Nombre original extraído del PDF',
  `extraction_confidence` DECIMAL(3,2) DEFAULT 1.00 COMMENT 'Confianza de extracción (0-1)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_catalog_id`)
    REFERENCES `products_catalog`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (`product_variation_id`)
    REFERENCES `product_variations`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (`measurement_unit_id`)
    REFERENCES `measurement_units`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX `idx_date` (`date`),
  INDEX `idx_product_date` (`product_catalog_id`, `date`),
  INDEX `idx_source` (`source`),
  INDEX `idx_date_source` (`date`, `source`),
  UNIQUE KEY `uk_product_date_source` (`product_catalog_id`, `product_variation_id`, `measurement_unit_id`, `date`, `source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Precios históricos del mercado (Corabastos)';

-- =====================================================
-- TABLA: price_trends
-- Tendencias de precios calculadas automáticamente
-- =====================================================
CREATE TABLE IF NOT EXISTS `price_trends` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_catalog_id` INT NOT NULL,
  `period_start` DATE NOT NULL COMMENT 'Inicio del período de análisis',
  `period_end` DATE NOT NULL COMMENT 'Fin del período de análisis',
  `avg_price` DECIMAL(12,2) NOT NULL COMMENT 'Precio promedio del período',
  `min_price` DECIMAL(12,2) NOT NULL COMMENT 'Precio mínimo del período',
  `max_price` DECIMAL(12,2) NOT NULL COMMENT 'Precio máximo del período',
  `price_volatility` DECIMAL(8,2) NULL COMMENT 'Desviación estándar del precio',
  `trend_direction` ENUM('UP', 'DOWN', 'STABLE') DEFAULT 'STABLE' COMMENT 'Dirección de la tendencia',
  `price_change_percentage` DECIMAL(6,2) NULL COMMENT 'Cambio porcentual en el período',
  `data_points` INT DEFAULT 0 COMMENT 'Cantidad de registros usados para cálculo',
  `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_catalog_id`)
    REFERENCES `products_catalog`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX `idx_product_period` (`product_catalog_id`, `period_start`, `period_end`),
  INDEX `idx_period_end` (`period_end`),
  INDEX `idx_trend_direction` (`trend_direction`),
  UNIQUE KEY `uk_product_period` (`product_catalog_id`, `period_start`, `period_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tendencias de precios calculadas';

-- =====================================================
-- TABLA: recommendations
-- Historial de recomendaciones generadas
-- =====================================================
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NULL COMMENT 'Publicación relacionada (si aplica)',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Usuario que recibió la recomendación',
  `product_catalog_id` INT NOT NULL,
  `user_price` DECIMAL(12,2) NOT NULL COMMENT 'Precio propuesto por el usuario (COP)',
  `market_avg_price` DECIMAL(12,2) NOT NULL COMMENT 'Precio promedio de mercado (COP)',
  `market_min_price` DECIMAL(12,2) NULL COMMENT 'Precio mínimo de mercado (COP)',
  `market_max_price` DECIMAL(12,2) NULL COMMENT 'Precio máximo de mercado (COP)',
  `recommendation_type` ENUM(
    'MUY_POR_DEBAJO',
    'POR_DEBAJO',
    'EN_RANGO',
    'POR_ENCIMA',
    'MUY_POR_ENCIMA',
    'NO_DATA'
  ) NOT NULL COMMENT 'Tipo de recomendación generada',
  `difference_percentage` DECIMAL(6,2) NULL COMMENT 'Porcentaje de diferencia vs mercado',
  `suggestion_text` TEXT NULL COMMENT 'Texto completo de la recomendación',
  `was_accepted` TINYINT(1) DEFAULT NULL COMMENT '¿Usuario aceptó la recomendación?',
  `final_price` DECIMAL(12,2) NULL COMMENT 'Precio final publicado',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`post_id`)
    REFERENCES `posts`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`product_catalog_id`)
    REFERENCES `products_catalog`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_post` (`post_id`),
  INDEX `idx_product` (`product_catalog_id`),
  INDEX `idx_created` (`created_at`),
  INDEX `idx_recommendation_type` (`recommendation_type`),
  INDEX `idx_user_created` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de recomendaciones de precios';

-- =====================================================
-- TABLA: ingestion_logs
-- Logs de ingesta de datos desde fuentes externas
-- =====================================================
CREATE TABLE IF NOT EXISTS `ingestion_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(100) NOT NULL DEFAULT 'Corabastos' COMMENT 'Fuente de datos',
  `ingestion_date` DATE NOT NULL COMMENT 'Fecha del boletín procesado',
  `status` ENUM('SUCCESS', 'PARTIAL', 'FAILED') NOT NULL COMMENT 'Estado del proceso',
  `products_extracted` INT DEFAULT 0 COMMENT 'Productos extraídos del PDF',
  `products_inserted` INT DEFAULT 0 COMMENT 'Productos insertados exitosamente',
  `products_failed` INT DEFAULT 0 COMMENT 'Productos que fallaron',
  `normalization_success` INT DEFAULT 0 COMMENT 'Productos normalizados correctamente',
  `normalization_failed` INT DEFAULT 0 COMMENT 'Productos sin normalizar',
  `execution_time_seconds` DECIMAL(8,2) NULL COMMENT 'Tiempo de ejecución en segundos',
  `error_message` TEXT NULL COMMENT 'Mensaje de error (si aplica)',
  `raw_data` JSON NULL COMMENT 'Datos crudos extraídos (para debug)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_source_date` (`source`, `ingestion_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Logs de procesos de ingesta de datos';

-- =====================================================
-- TABLA: normalization_queue
-- Cola de productos pendientes de normalización
-- =====================================================
CREATE TABLE IF NOT EXISTS `normalization_queue` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `raw_product_name` VARCHAR(300) NOT NULL COMMENT 'Nombre crudo extraído',
  `category` VARCHAR(100) NULL COMMENT 'Categoría detectada',
  `source` VARCHAR(100) NOT NULL COMMENT 'Fuente del dato',
  `status` ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'FAILED') DEFAULT 'PENDING',
  `mapped_product_id` INT NULL COMMENT 'ID del producto al que se mapeó',
  `mapped_variation_id` INT NULL COMMENT 'ID de la variación (si aplica)',
  `confidence_score` DECIMAL(3,2) NULL COMMENT 'Confianza del mapeo (0-1)',
  `attempts` INT DEFAULT 0 COMMENT 'Intentos de normalización',
  `last_attempt_at` TIMESTAMP NULL,
  `resolved_at` TIMESTAMP NULL,
  `notes` TEXT NULL COMMENT 'Notas del proceso',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mapped_product_id`)
    REFERENCES `products_catalog`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (`mapped_variation_id`)
    REFERENCES `product_variations`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX `idx_status` (`status`),
  INDEX `idx_source` (`source`),
  INDEX `idx_raw_name` (`raw_product_name`(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cola de productos pendientes de normalización';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Últimos precios por producto
CREATE OR REPLACE VIEW `v_latest_market_prices` AS
SELECT
    mp.id,
    pc.name AS product_name,
    pc.category,
    pv.variation_name,
    mu.unit_name,
    mp.quantity,
    mp.price_unit,
    mp.price_extra,
    mp.price_first,
    mp.price_variation,
    mp.date,
    mp.source
FROM market_prices mp
INNER JOIN products_catalog pc ON mp.product_catalog_id = pc.id
LEFT JOIN product_variations pv ON mp.product_variation_id = pv.id
INNER JOIN measurement_units mu ON mp.measurement_unit_id = mu.id
WHERE mp.date = (
    SELECT MAX(date)
    FROM market_prices mp2
    WHERE mp2.product_catalog_id = mp.product_catalog_id
)
ORDER BY pc.category, pc.name;

-- Vista: Tendencias recientes
CREATE OR REPLACE VIEW `v_recent_trends` AS
SELECT
    pc.name AS product_name,
    pc.category,
    pt.period_start,
    pt.period_end,
    pt.avg_price,
    pt.min_price,
    pt.max_price,
    pt.price_volatility,
    pt.trend_direction,
    pt.price_change_percentage,
    pt.data_points,
    pt.calculated_at
FROM price_trends pt
INNER JOIN products_catalog pc ON pt.product_catalog_id = pc.id
WHERE pt.period_end >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY pt.period_end DESC, pc.category, pc.name;

-- Vista: Productos más volátiles
CREATE OR REPLACE VIEW `v_volatile_products` AS
SELECT
    pc.name AS product_name,
    pc.category,
    AVG(pt.price_volatility) AS avg_volatility,
    AVG(ABS(pt.price_change_percentage)) AS avg_change_percentage,
    COUNT(*) AS trend_records
FROM price_trends pt
INNER JOIN products_catalog pc ON pt.product_catalog_id = pc.id
WHERE pt.period_end >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY pc.id, pc.name, pc.category
HAVING avg_volatility IS NOT NULL
ORDER BY avg_volatility DESC, avg_change_percentage DESC
LIMIT 50;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Calcular tendencias para un producto
CREATE PROCEDURE `sp_calculate_product_trend`(
    IN p_product_id INT,
    IN p_days INT
)
BEGIN
    DECLARE v_period_start DATE;
    DECLARE v_period_end DATE;

    SET v_period_end = CURDATE();
    SET v_period_start = DATE_SUB(v_period_end, INTERVAL p_days DAY);

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
        data_points
    )
    SELECT
        p_product_id,
        v_period_start,
        v_period_end,
        AVG(price_unit),
        MIN(price_unit),
        MAX(price_unit),
        STDDEV(price_unit),
        CASE
            WHEN (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date >= DATE_SUB(v_period_end, INTERVAL 7 DAY)
            ) > (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date BETWEEN v_period_start AND DATE_SUB(v_period_end, INTERVAL 8 DAY)
            ) * 1.05 THEN 'UP'
            WHEN (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date >= DATE_SUB(v_period_end, INTERVAL 7 DAY)
            ) < (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date BETWEEN v_period_start AND DATE_SUB(v_period_end, INTERVAL 8 DAY)
            ) * 0.95 THEN 'DOWN'
            ELSE 'STABLE'
        END,
        (
            (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date >= DATE_SUB(v_period_end, INTERVAL 7 DAY)
            ) - (
                SELECT AVG(price_unit)
                FROM market_prices
                WHERE product_catalog_id = p_product_id
                AND date BETWEEN v_period_start AND DATE_SUB(v_period_end, INTERVAL 8 DAY)
            )
        ) / (
            SELECT AVG(price_unit)
            FROM market_prices
            WHERE product_catalog_id = p_product_id
            AND date BETWEEN v_period_start AND DATE_SUB(v_period_end, INTERVAL 8 DAY)
        ) * 100,
        COUNT(*)
    FROM market_prices
    WHERE product_catalog_id = p_product_id
    AND date >= v_period_start
    ON DUPLICATE KEY UPDATE
        avg_price = VALUES(avg_price),
        min_price = VALUES(min_price),
        max_price = VALUES(max_price),
        price_volatility = VALUES(price_volatility),
        trend_direction = VALUES(trend_direction),
        price_change_percentage = VALUES(price_change_percentage),
        data_points = VALUES(data_points),
        updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger: Actualizar timestamp en products_catalog
CREATE TRIGGER `tr_products_catalog_update`
BEFORE UPDATE ON `products_catalog`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- Trigger: Validar precio unit en market_prices
CREATE TRIGGER `tr_market_prices_validate`
BEFORE INSERT ON `market_prices`
FOR EACH ROW
BEGIN
    IF NEW.price_unit <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'price_unit must be greater than 0';
    END IF;

    IF NEW.quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'quantity must be greater than 0';
    END IF;
END//

DELIMITER ;

-- =====================================================
-- INDICES ADICIONALES PARA PERFORMANCE
-- =====================================================

-- Índice compuesto para consultas frecuentes de market_prices
ALTER TABLE `market_prices`
ADD INDEX `idx_product_date_price` (`product_catalog_id`, `date`, `price_unit`);

-- Índice para búsquedas por rango de fecha
ALTER TABLE `market_prices`
ADD INDEX `idx_date_range` (`date`, `source`, `product_catalog_id`);

-- =====================================================
-- RESTAURAR CONFIGURACIONES
-- =====================================================

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================

SELECT 'MAI Intelligence Module - Database Migration Completed Successfully!' AS Status;
