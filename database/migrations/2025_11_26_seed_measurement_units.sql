-- =====================================================
-- MAI INTELLIGENCE MODULE - SEED MEASUREMENT UNITS
-- Fecha: 2025-11-26
-- Descripción: Poblar unidades de medida base del sistema
-- Autor: Claude Code (Autonomous)
-- =====================================================

USE `mai_db`;

-- Limpiar tabla si existe data previa (solo para desarrollo)
-- TRUNCATE TABLE `measurement_units`;

-- =====================================================
-- UNIDADES DE PESO
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('KILO', 'weight', 1.0000, 'Kilogramo - Unidad base de peso'),
('GRAMO', 'weight', 0.0010, 'Gramo - 1/1000 de kilogramo'),
('TONELADA', 'weight', 1000.0000, 'Tonelada - 1000 kilogramos'),
('LIBRA', 'weight', 0.4536, 'Libra - Aproximadamente 453.6 gramos'),
('ARROBA', 'weight', 11.5000, 'Arroba - Unidad tradicional colombiana (aprox 11.5 kg)'),
('QUINTAL', 'weight', 50.0000, 'Quintal - 50 kilogramos'),
('BULTO', 'weight', 50.0000, 'Bulto estándar - Generalmente 50 kg'),
('BULTO 25KG', 'weight', 25.0000, 'Bulto de 25 kilogramos'),
('BULTO 30KG', 'weight', 30.0000, 'Bulto de 30 kilogramos'),
('BULTO 40KG', 'weight', 40.0000, 'Bulto de 40 kilogramos'),
('BULTO 60KG', 'weight', 60.0000, 'Bulto de 60 kilogramos'),
('25 LIBRAS', 'weight', 11.3400, '25 libras - Aproximadamente 11.34 kg'),
('50 LIBRAS', 'weight', 22.6800, '50 libras - Aproximadamente 22.68 kg')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    kg_equivalent = VALUES(kg_equivalent),
    description = VALUES(description);

-- =====================================================
-- UNIDADES DE VOLUMEN
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('LITRO', 'volume', NULL, 'Litro - Unidad de volumen'),
('GALON', 'volume', NULL, 'Galón - Aproximadamente 3.785 litros'),
('MILILITRO', 'volume', NULL, 'Mililitro - 1/1000 de litro'),
('CENTILITRO', 'volume', NULL, 'Centilitro - 1/100 de litro')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    description = VALUES(description);

-- =====================================================
-- UNIDADES DE CONTEO / EMPAQUE
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('UNIDAD', 'count', NULL, 'Unidad individual'),
('DOCENA', 'count', NULL, 'Docena - 12 unidades'),
('CIENTO', 'count', NULL, 'Ciento - 100 unidades'),
('MILLAR', 'count', NULL, 'Millar - 1000 unidades'),
('PAR', 'count', NULL, 'Par - 2 unidades'),
('30 UNIDADES', 'count', NULL, 'Paquete de 30 unidades (común en huevos)'),
('6 UNIDADES', 'count', NULL, 'Paquete de 6 unidades'),
('12 UNIDADES', 'count', NULL, 'Paquete de 12 unidades')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    description = VALUES(description);

-- =====================================================
-- UNIDADES DE EMPAQUE ESPECÍFICAS
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('CAJA', 'count', NULL, 'Caja - Cantidad variable según producto'),
('CAJA DE MADERA', 'count', NULL, 'Caja de madera - Empaque tradicional'),
('CANASTILLA', 'count', NULL, 'Canastilla - Empaque común en frutas y hortalizas'),
('CANASTA', 'count', NULL, 'Canasta - Similar a canastilla'),
('BANDEJA', 'count', NULL, 'Bandeja - Empaque plano'),
('BOLSA', 'count', NULL, 'Bolsa - Empaque flexible'),
('SACO', 'count', NULL, 'Saco - Empaque grande de tela o polipropileno'),
('ATADO', 'count', NULL, 'Atado - Conjunto de unidades amarradas'),
('ROLLO', 'count', NULL, 'Rollo - Empaque cilíndrico'),
('PAQUETE', 'count', NULL, 'Paquete - Empaque genérico'),
('MALLA', 'count', NULL, 'Malla - Red contenedora'),
('CUBETA', 'count', NULL, 'Cubeta - Contenedor de plástico'),
('COSTAL', 'count', NULL, 'Costal - Saco grande de fibra'),
('LATA', 'count', NULL, 'Lata - Contenedor metálico'),
('TARRO', 'count', NULL, 'Tarro - Contenedor de vidrio o plástico')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    description = VALUES(description);

-- =====================================================
-- UNIDADES ESPECÍFICAS DE CORABASTOS
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('CANASTILLA 22', 'count', NULL, 'Canastilla de 22 unidades (común en plátano)'),
('CANASTILLA 25', 'count', NULL, 'Canastilla de 25 unidades'),
('CAJA 10', 'count', NULL, 'Caja de 10 unidades'),
('CAJA 11', 'count', NULL, 'Caja de 11 unidades (común en mangos)'),
('CAJA 12', 'count', NULL, 'Caja de 12 unidades'),
('CAJA 14', 'count', NULL, 'Caja de 14 unidades (común en granadilla)'),
('CAJA 18', 'count', NULL, 'Caja de 18 unidades (común en manzanas)'),
('CAJA 20', 'count', NULL, 'Caja de 20 unidades'),
('CAJA 24', 'count', NULL, 'Caja de 24 unidades'),
('CAJA DE MADERA 10', 'count', NULL, 'Caja de madera de 10 unidades'),
('CAJA DE MADERA 18', 'count', NULL, 'Caja de madera de 18 unidades'),
('CAJA DE MADERA 30', 'count', NULL, 'Caja de madera de 30 unidades'),
('CAJA DE MADERA 32', 'count', NULL, 'Caja de madera de 32 unidades (común en piña)'),
('BOLSA 10', 'count', NULL, 'Bolsa de 10 unidades/kg'),
('BOLSA 20', 'count', NULL, 'Bolsa de 20 unidades/kg'),
('BOLSA 30', 'count', NULL, 'Bolsa de 30 unidades/kg (común en yuca)'),
('ATADO 3', 'count', NULL, 'Atado de 3 unidades'),
('ATADO 10', 'count', NULL, 'Atado de 10 unidades'),
('ROLLO 25', 'count', NULL, 'Rollo de 25 unidades (común en cebolla larga)'),
('DOCENA 10', 'count', NULL, 'Conjunto de 10 docenas')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    description = VALUES(description);

-- =====================================================
-- UNIDADES COMERCIALES ESPECIALES
-- =====================================================

INSERT INTO `measurement_units` (`unit_name`, `unit_type`, `kg_equivalent`, `description`) VALUES
('PAQUETE 5', 'count', NULL, 'Paquete de 5 unidades'),
('RACIMO', 'count', NULL, 'Racimo - Conjunto natural (banano, uvas)'),
('RAMO', 'count', NULL, 'Ramo - Conjunto de flores o hierbas'),
('MANOJO', 'count', NULL, 'Manojo - Conjunto pequeño amarrado'),
('PILON', 'count', NULL, 'Pilón - Conjunto grande (plátano)'),
('MANO', 'count', NULL, 'Mano - Subdivisión de racimo (banano)')
ON DUPLICATE KEY UPDATE
    unit_type = VALUES(unit_type),
    description = VALUES(description);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Mostrar resumen de unidades insertadas
SELECT
    unit_type,
    COUNT(*) as total_units,
    COUNT(kg_equivalent) as units_with_kg_equivalent
FROM measurement_units
WHERE is_active = 1
GROUP BY unit_type
ORDER BY unit_type;

-- Mostrar todas las unidades de peso con equivalencia
SELECT
    unit_name,
    kg_equivalent,
    description
FROM measurement_units
WHERE unit_type = 'weight'
AND is_active = 1
ORDER BY kg_equivalent DESC;

-- =====================================================
-- FIN DEL SEED
-- =====================================================

SELECT 'Measurement Units Seed Completed Successfully!' AS Status,
       COUNT(*) AS Total_Units
FROM measurement_units
WHERE is_active = 1;
