-- =====================================================
-- MAI INTELLIGENCE MODULE - SEED PRODUCTS CATALOG
-- Fecha: 2025-11-26
-- Descripción: Poblar catálogo de productos agrícolas
-- Autor: Claude Code (Autonomous)
-- Basado en: Boletín Corabastos 14-Oct-2025
-- =====================================================

USE `mai_db`;

-- =====================================================
-- CATEGORÍA: TUBÉRCULOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('PAPA CRIOLLA', 'Tubérculos', JSON_ARRAY('papa criolla lavada', 'papa criolla sucia', 'criolla'), 'Papa criolla colombiana'),
('PAPA PASTUSA', 'Tubérculos', JSON_ARRAY('pastusa', 'papa blanca'), 'Papa pastusa de consumo común'),
('PAPA R12', 'Tubérculos', JSON_ARRAY('papa r12 industrial', 'papa r12 negra', 'papa r12 roja', 'r12'), 'Papa R12 variedad industrial'),
('PAPA SABANERA', 'Tubérculos', JSON_ARRAY('sabanera'), 'Papa sabanera'),
('PAPA SUPREMA', 'Tubérculos', JSON_ARRAY('suprema'), 'Papa suprema'),
('PAPA TOCARRE', 'Tubérculos', JSON_ARRAY('tocarre'), 'Papa tocarre'),
('YUCA', 'Tubérculos', JSON_ARRAY('yuca armenia', 'yuca llanera', 'mandioca'), 'Yuca o mandioca'),
('ARRACACHA', 'Tubérculos', JSON_ARRAY('apio criollo', 'zanahoria blanca'), 'Arracacha o apio')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: HORTALIZAS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('TOMATE CHONTO', 'Hortalizas', JSON_ARRAY('tomate', 'chonto'), 'Tomate chonto común'),
('TOMATE LARGA VIDA', 'Hortalizas', JSON_ARRAY('tomate larga vida', 'larga vida'), 'Tomate de larga duración'),
('TOMATE MILANO', 'Hortalizas', JSON_ARRAY('tomate milano', 'milano'), 'Tomate milano'),
('CEBOLLA CABEZONA BLANCA', 'Hortalizas', JSON_ARRAY('cebolla blanca', 'cabezona blanca'), 'Cebolla cabezona blanca'),
('CEBOLLA CABEZONA ROJA', 'Hortalizas', JSON_ARRAY('cebolla roja', 'cabezona roja'), 'Cebolla cabezona roja'),
('CEBOLLA LARGA', 'Hortalizas', JSON_ARRAY('cebolla junca', 'cebolla de rama'), 'Cebolla larga o junca'),
('ZANAHORIA', 'Hortalizas', JSON_ARRAY(), 'Zanahoria'),
('LECHUGA', 'Hortalizas', JSON_ARRAY('lechuga crespa', 'lechuga batavia'), 'Lechuga'),
('CILANTRO', 'Hortalizas', JSON_ARRAY('cilantro liso'), 'Cilantro'),
('ACELGA', 'Hortalizas', JSON_ARRAY(), 'Acelga'),
('AHUYAMA', 'Hortalizas', JSON_ARRAY('zapallo', 'calabaza'), 'Ahuyama o calabaza'),
('AJO', 'Hortalizas', JSON_ARRAY('ajo rosado', 'ajo blanco'), 'Ajo'),
('ALCACHOFA', 'Hortalizas', JSON_ARRAY(), 'Alcachofa'),
('APIO', 'Hortalizas', JSON_ARRAY('apio españa'), 'Apio'),
('ARVEJA VERDE', 'Hortalizas', JSON_ARRAY('arveja verde sabanera', 'arveja'), 'Arveja verde'),
('BERENJENA', 'Hortalizas', JSON_ARRAY(), 'Berenjena'),
('BROCOLI', 'Hortalizas', JSON_ARRAY('brócoli'), 'Brócoli'),
('CALABACIN', 'Hortalizas', JSON_ARRAY('calabacín', 'zucchini'), 'Calabacín'),
('CALABAZA', 'Hortalizas', JSON_ARRAY(), 'Calabaza'),
('COLIFLOR', 'Hortalizas', JSON_ARRAY(), 'Coliflor'),
('ESPINACA', 'Hortalizas', JSON_ARRAY(), 'Espinaca'),
('FRIJOL VERDE', 'Hortalizas', JSON_ARRAY('habichuela verde'), 'Fríjol verde'),
('HABA VERDE', 'Hortalizas', JSON_ARRAY('haba verde sabanera'), 'Haba verde'),
('HABICHUELA', 'Hortalizas', JSON_ARRAY(), 'Habichuela'),
('MAZORCA', 'Hortalizas', JSON_ARRAY('maíz tierno', 'choclo'), 'Mazorca tierna'),
('PEPINO COHOMBRO', 'Hortalizas', JSON_ARRAY('cohombro'), 'Pepino cohombro'),
('PEPINO COMUN', 'Hortalizas', JSON_ARRAY('pepino'), 'Pepino común'),
('PIMENTON', 'Hortalizas', JSON_ARRAY('pimiento', 'pimentón'), 'Pimentón'),
('RABANO ROJO', 'Hortalizas', JSON_ARRAY('rábano'), 'Rábano rojo'),
('REMOLACHA', 'Hortalizas', JSON_ARRAY('betabel'), 'Remolacha'),
('REPOLLO', 'Hortalizas', JSON_ARRAY('col'), 'Repollo')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: FRUTAS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('AGUACATE HASS', 'Frutas', JSON_ARRAY('aguacate', 'hass'), 'Aguacate variedad Hass'),
('AGUACATE PIELES VERDES', 'Frutas', JSON_ARRAY('aguacate papelillo', 'aguacate común'), 'Aguacate pieles verdes'),
('BANANO CRIOLLO', 'Frutas', JSON_ARRAY('banano', 'guineo'), 'Banano criollo'),
('BANANO URABÁ', 'Frutas', JSON_ARRAY('banano de exportación'), 'Banano de Urabá'),
('BREVA', 'Frutas', JSON_ARRAY('higo'), 'Breva'),
('COCO', 'Frutas', JSON_ARRAY(), 'Coco'),
('CURUBA', 'Frutas', JSON_ARRAY('curuba boyacense', 'curuba san bernardo'), 'Curuba'),
('DURAZNO', 'Frutas', JSON_ARRAY('durazno importado', 'durazno nacional'), 'Durazno'),
('FEIJOA', 'Frutas', JSON_ARRAY('feijoa colombiana'), 'Feijoa'),
('FRESA', 'Frutas', JSON_ARRAY('frutilla'), 'Fresa'),
('GRANADILLA', 'Frutas', JSON_ARRAY(), 'Granadilla'),
('GUANABANA', 'Frutas', JSON_ARRAY('guanábana'), 'Guanábana'),
('GUAYABA', 'Frutas', JSON_ARRAY('guayaba pera', 'guayaba manzana'), 'Guayaba'),
('LIMON COMUN', 'Frutas', JSON_ARRAY('limón', 'limón común'), 'Limón común'),
('LIMON TAHITI', 'Frutas', JSON_ARRAY('limón tahití', 'lima ácida'), 'Limón Tahití'),
('LULO', 'Frutas', JSON_ARRAY('naranjilla'), 'Lulo'),
('MANDARINA', 'Frutas', JSON_ARRAY('mandarina arrayana', 'mandarina oneco'), 'Mandarina'),
('MANGO', 'Frutas', JSON_ARRAY('mango chancleto', 'mango de azucar', 'mango reina', 'mango tommy'), 'Mango'),
('MANZANA', 'Frutas', JSON_ARRAY('manzana nacional', 'manzana roja', 'manzana verde'), 'Manzana'),
('MARACUYA', 'Frutas', JSON_ARRAY('maracuyá', 'parchita'), 'Maracuyá'),
('MELON', 'Frutas', JSON_ARRAY('melón'), 'Melón'),
('MORA', 'Frutas', JSON_ARRAY('mora de castilla'), 'Mora de Castilla'),
('NARANJA', 'Frutas', JSON_ARRAY('naranja armenia', 'naranja grey', 'naranja ombligona', 'naranja valencia'), 'Naranja'),
('PAPAYA', 'Frutas', JSON_ARRAY('papaya hawaiana', 'papaya maradol', 'papaya melona', 'papaya redonda', 'papaya tainung'), 'Papaya'),
('PATILLA', 'Frutas', JSON_ARRAY('sandía'), 'Patilla o sandía'),
('PINA', 'Frutas', JSON_ARRAY('piña', 'piña gold', 'piña perolera', 'ananá'), 'Piña'),
('PITAHAYA', 'Frutas', JSON_ARRAY('pitaya'), 'Pitahaya'),
('TOMATE DE ARBOL', 'Frutas', JSON_ARRAY('tamarillo'), 'Tomate de árbol'),
('UVA', 'Frutas', JSON_ARRAY('uva champa', 'uva negra', 'uva roja'), 'Uva')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: PLÁTANOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('PLATANO COLICERO', 'Plátanos', JSON_ARRAY('plátano colicero'), 'Plátano colicero'),
('PLATANO HARTON', 'Plátanos', JSON_ARRAY('plátano hartón', 'hartón'), 'Plátano hartón')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: GRANOS Y PROCESADOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('ARROZ CORRIENTE', 'Granos y Procesados', JSON_ARRAY('arroz'), 'Arroz corriente'),
('ARROZ ORYZICA', 'Granos y Procesados', JSON_ARRAY('oryzica'), 'Arroz oryzica'),
('ARROZ SOPA', 'Granos y Procesados', JSON_ARRAY('arroz cristal'), 'Arroz para sopa'),
('ARVEJA SECA', 'Granos y Procesados', JSON_ARRAY('arveja verde seca'), 'Arveja verde seca'),
('AZUCAR', 'Granos y Procesados', JSON_ARRAY('azúcar empacada', 'azúcar sulfitada'), 'Azúcar'),
('CAFE', 'Granos y Procesados', JSON_ARRAY('café'), 'Café'),
('FRIJOL', 'Granos y Procesados', JSON_ARRAY('fríjol nima calima', 'fríjol radical'), 'Fríjol'),
('GARBANZO', 'Granos y Procesados', JSON_ARRAY(), 'Garbanzo'),
('HARINA DE MAIZ', 'Granos y Procesados', JSON_ARRAY('harina precocida'), 'Harina de maíz'),
('HARINA DE TRIGO', 'Granos y Procesados', JSON_ARRAY(), 'Harina de trigo'),
('MAIZ', 'Granos y Procesados', JSON_ARRAY('maíz amarillo', 'maíz blanco', 'maíz trillado'), 'Maíz'),
('PANELA', 'Granos y Procesados', JSON_ARRAY(), 'Panela'),
('SAL', 'Granos y Procesados', JSON_ARRAY(), 'Sal')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: POLLO
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('ALAS DE POLLO', 'Pollo', JSON_ARRAY('alitas'), 'Alas de pollo'),
('MENUDENCIAS', 'Pollo', JSON_ARRAY('menudos'), 'Menudencias de pollo'),
('PECHUGA DE POLLO', 'Pollo', JSON_ARRAY('pechuga'), 'Pechuga de pollo'),
('PERNILES DE POLLO', 'Pollo', JSON_ARRAY('pernil', 'pierna'), 'Perniles de pollo'),
('POLLO', 'Pollo', JSON_ARRAY('pollo sin visceras', 'pollo entero'), 'Pollo entero')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: PESCADOS Y MARISCOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('BAGRE', 'Pescados y Mariscos', JSON_ARRAY('bagre dorado', 'bagre pintado'), 'Bagre'),
('BLANQUILLO', 'Pescados y Mariscos', JSON_ARRAY('blanquillo gallego'), 'Blanquillo'),
('BOCA CHICO', 'Pescados y Mariscos', JSON_ARRAY('bocachico'), 'Bocachico'),
('CACHAMA', 'Pescados y Mariscos', JSON_ARRAY(), 'Cachama'),
('CAJARO', 'Pescados y Mariscos', JSON_ARRAY(), 'Cajaro'),
('CAMARON', 'Pescados y Mariscos', JSON_ARRAY('camarón tigre', 'camarón titi'), 'Camarón'),
('CAPACETA', 'Pescados y Mariscos', JSON_ARRAY(), 'Capaceta'),
('CARACOL', 'Pescados y Mariscos', JSON_ARRAY('caracol almeja'), 'Caracol'),
('CORVINA', 'Pescados y Mariscos', JSON_ARRAY(), 'Corvina'),
('CUCHA', 'Pescados y Mariscos', JSON_ARRAY(), 'Cucha'),
('DONCELLA', 'Pescados y Mariscos', JSON_ARRAY(), 'Doncella'),
('FILETE DE MERLUZA', 'Pescados y Mariscos', JSON_ARRAY('merluza'), 'Filete de merluza'),
('FILETE DE ROBALO', 'Pescados y Mariscos', JSON_ARRAY('róbalo'), 'Filete de róbalo'),
('MOJARRA', 'Pescados y Mariscos', JSON_ARRAY('mojarra de mar', 'mojarra roja', 'tilapia'), 'Mojarra'),
('NICURO', 'Pescados y Mariscos', JSON_ARRAY(), 'Nicuro'),
('PALETON', 'Pescados y Mariscos', JSON_ARRAY('paletón'), 'Paletón'),
('PELADA', 'Pescados y Mariscos', JSON_ARRAY(), 'Pelada'),
('PESCADO SECO', 'Pescados y Mariscos', JSON_ARRAY(), 'Pescado seco'),
('PEZ MERO', 'Pescados y Mariscos', JSON_ARRAY('mero', 'pollito de mar'), 'Pez mero'),
('PIRA BOTON', 'Pescados y Mariscos', JSON_ARRAY('pira botón'), 'Pira botón'),
('SIERRA', 'Pescados y Mariscos', JSON_ARRAY(), 'Sierra'),
('TIBURON', 'Pescados y Mariscos', JSON_ARRAY('toyo', 'tiburón pequeño'), 'Tiburón'),
('TRUCHA', 'Pescados y Mariscos', JSON_ARRAY('trucha arco iris'), 'Trucha'),
('VALENTON', 'Pescados y Mariscos', JSON_ARRAY('valentón'), 'Valentón')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: CÁRNICOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('CADERA', 'Cárnicos', JSON_ARRAY('cadera de res'), 'Cadera de res'),
('CHATAS', 'Cárnicos', JSON_ARRAY(), 'Chatas de res'),
('COSTILLA', 'Cárnicos', JSON_ARRAY('costilla de res'), 'Costilla de res'),
('LOMO', 'Cárnicos', JSON_ARRAY('lomo de res'), 'Lomo de res'),
('PIERNA', 'Cárnicos', JSON_ARRAY('pierna de res'), 'Pierna de res'),
('SOBREBARRIGA', 'Cárnicos', JSON_ARRAY(), 'Sobrebarriga')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: HUEVOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('HUEVO BLANCO', 'Huevos', JSON_ARRAY('huevo blanco a', 'huevo blanco aa', 'huevo blanco b', 'huevo blanco extra'), 'Huevo blanco'),
('HUEVO ROJO', 'Huevos', JSON_ARRAY('huevo rojo a', 'huevo rojo aa', 'huevo rojo b', 'huevo rojo extra'), 'Huevo rojo')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- CATEGORÍA: LÁCTEOS
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('CUAJADA', 'Lácteos', JSON_ARRAY(), 'Cuajada'),
('QUESO CAMPESINO', 'Lácteos', JSON_ARRAY('queso fresco'), 'Queso campesino'),
('QUESO COSTE', 'Lácteos', JSON_ARRAY('costeño'), 'Queso costeño'),
('QUESO DOBLE CREMA', 'Lácteos', JSON_ARRAY(), 'Queso doble crema'),
('QUESO PAIPA', 'Lácteos', JSON_ARRAY(), 'Queso paipa'),
('QUESO PERA', 'Lácteos', JSON_ARRAY(), 'Queso pera')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- PRODUCTOS ADICIONALES COMUNES
-- =====================================================

INSERT INTO `products_catalog` (`name`, `category`, `aliases`, `description`) VALUES
('ACEITE', 'Granos y Procesados', JSON_ARRAY('aceite de cocina'), 'Aceite de cocina'),
('CEBADA', 'Granos y Procesados', JSON_ARRAY(), 'Cebada'),
('CHOCOLATE', 'Granos y Procesados', JSON_ARRAY('chocolate dulce'), 'Chocolate'),
('CUCHUCO', 'Granos y Procesados', JSON_ARRAY('cuchuco de cebada', 'cuchuco de maíz', 'cuchuco de trigo'), 'Cuchuco'),
('LECHE EN POLVO', 'Lácteos', JSON_ARRAY('leche polvo'), 'Leche en polvo'),
('MANTECA', 'Granos y Procesados', JSON_ARRAY('manteca hidrogenada'), 'Manteca'),
('MARGARINA', 'Granos y Procesados', JSON_ARRAY(), 'Margarina'),
('PASTA', 'Granos y Procesados', JSON_ARRAY('pastas alimenticias'), 'Pasta alimenticia'),
('GUALAJO', 'Pescados y Mariscos', JSON_ARRAY(), 'Gualajo')
ON DUPLICATE KEY UPDATE
    aliases = VALUES(aliases),
    description = VALUES(description);

-- =====================================================
-- VERIFICACIÓN Y ESTADÍSTICAS
-- =====================================================

-- Contar productos por categoría
SELECT
    category,
    COUNT(*) as total_products,
    COUNT(CASE WHEN JSON_LENGTH(aliases) > 0 THEN 1 END) as products_with_aliases
FROM products_catalog
WHERE is_active = 1
GROUP BY category
ORDER BY total_products DESC;

-- Mostrar total de productos
SELECT
    COUNT(*) as total_products,
    COUNT(DISTINCT category) as total_categories
FROM products_catalog
WHERE is_active = 1;

-- =====================================================
-- FIN DEL SEED
-- =====================================================

SELECT 'Products Catalog Seed Completed Successfully!' AS Status,
       COUNT(*) AS Total_Products,
       COUNT(DISTINCT category) AS Total_Categories
FROM products_catalog
WHERE is_active = 1;
