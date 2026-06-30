-- Clean existing seed data to prevent conflicts
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- ─── CATEGORIES ─────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, image_url, position) VALUES
('11111111-1111-1111-1111-111111111111', 'Mesas de Pool', 'mesas-de-pool', 'Mesas de pool profesionales y familiares de alta calidad, fabricadas con materiales seleccionados.', 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop', 1),
('22222222-2222-2222-2222-222222222222', 'Mesas de Ping Pong', 'mesas-de-ping-pong', 'Mesas de ping pong plegables para interior y exterior, resistentes y con rebote reglamentario.', 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop', 2),
('33333333-3333-3333-3333-333333333333', 'Accesorios', 'accesorios', 'Tacos, bolas, tizas, triángulos, fundas y todo lo necesario para equipar tu sala de juegos.', 'https://images.unsplash.com/photo-1577712398418-7ab1a49db2bd?q=80&w=800&auto=format&fit=crop', 3),
('44444444-4444-4444-4444-444444444444', 'Paños y Tissus', 'panos-y-tissus', 'Paños y telas profesionales para mesas de pool de lana premium en variedad de colores.', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=800&auto=format&fit=crop', 4);

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────
INSERT INTO products (id, category_id, name, slug, description, price, stock, images, is_active, is_featured, sku, specifications) VALUES
-- Category 1: Mesas de Pool
('10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 
 'Mesa de Pool Profesional "Black Diamond" 8 Pies', 
 'mesa-de-pool-profesional-black-diamond-8-pies', 
 'Mesa de pool de nivel profesional construida con pizarra italiana de alta densidad, paño importado de lana peinada y estructura de madera maciza reforzada con detalles en cromo. Bandas de caucho natural que garantizan un rebote óptimo y troneras de cuero genuino.', 
 1850000.00, 3, 
 ARRAY['https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop'], 
 true, true, 'POOL-BD-08', 
 '{"Medidas": "2.54m x 1.42m", "Peso": "420 kg", "Material": "Madera maciza y Pizarra", "Troneras": "Cuero natural"}'::jsonb),

('10101010-1010-1010-1010-101010101011', '11111111-1111-1111-1111-111111111111', 
 'Mesa de Pool Familiar "Rústica de Roble"', 
 'mesa-de-pool-familiar-rustica-de-roble', 
 'Hermosa mesa de pool diseñada para el hogar, fabricada en madera de roble seleccionado con acabado rústico. Patas torneadas súper estables y campo de juego nivelado de MDF de alta densidad de 25mm. Incluye kit básico de juego.', 
 1200000.00, 5, 
 ARRAY['https://images.unsplash.com/photo-1609100096238-3051c5191151?q=80&w=800&auto=format&fit=crop'], 
 true, true, 'POOL-RUS-RO', 
 '{"Medidas": "2.20m x 1.25m", "Peso": "180 kg", "Material": "Madera de Roble y MDF", "Incluye": "2 tacos, bolas, triángulo y tizas"}'::jsonb),

-- Category 2: Mesas de Ping Pong
('20202020-2020-2020-2020-202020202020', '22222222-2222-2222-2222-222222222222', 
 'Mesa de Ping Pong Albatros Plegable Exterior', 
 'mesa-de-ping-pong-albatros-plegable-exterior', 
 'Mesa de ping pong diseñada para resistir la intemperie. Tablero de aluminio compuesto 100% impermeable a prueba de sol, lluvia y humedad. Estructura de acero galvanizado con recubrimiento en polvo, ruedas dobles con freno para transporte sencillo y sistema de plegado rápido con trabas de seguridad.', 
 680000.00, 8, 
 ARRAY['https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop'], 
 true, true, 'PP-ALB-EXT', 
 '{"Medidas": "Reglamentarias (2.74m x 1.52m)", "Tablero": "Aluminio 4mm", "Plegable": "Sí, doble hoja", "Ruedas": "4 dobles con freno"}'::jsonb),

('20202020-2020-2020-2020-202020202021', '22222222-2222-2222-2222-222222222222', 
 'Mesa de Ping Pong Profesional ITTF Premium Indoor', 
 'mesa-de-ping-pong-profesional-ittf-premium-indoor', 
 'Mesa de ping pong reglamentaria de alta competición aprobada por la ITTF. Tablero de MDF de 25 mm de espesor con acabado antirreflejo azul para un bote de bola perfecto. Chasis de acero reforzado y patas ajustables para nivelar el juego en superficies irregulares. Ideal para torneos.', 
 890000.00, 2, 
 ARRAY['https://images.unsplash.com/photo-1584813539744-8501317d4ea8?q=80&w=800&auto=format&fit=crop'], 
 true, false, 'PP-ITTF-IND', 
 '{"Medidas": "Reglamentarias (2.74m x 1.52m)", "Espesor": "25mm MDF", "Homologación": "ITTF", "Color": "Azul antirreflejo"}'::jsonb),

-- Category 3: Accesorios
('30303030-3030-3030-3030-303030303020', '33333333-3333-3333-3333-333333333333', 
 'Juego de Bolas Aramith Premium 57.2mm', 
 'juego-de-bolas-aramith-premium-57-2mm', 
 'El estándar mundial para el billar y pool. Juego de bolas de resina fenólica genuina Aramith. Máxima durabilidad, redondez perfecta y equilibrio constante para garantizar tiros precisos y reducir el desgaste del paño de tu mesa.', 
 135000.00, 15, 
 ARRAY['https://images.unsplash.com/photo-1563861826100-9cb868fdcd1d?q=80&w=800&auto=format&fit=crop'], 
 true, true, 'ACC-BOL-AR', 
 '{"Diámetro": "57.2 mm (Reglamentario)", "Material": "Resina Fenólica", "Fabricante": "Saluc (Bélgica)"}'::jsonb),

('30303030-3030-3030-3030-303030303021', '33333333-3333-3333-3333-333333333333', 
 'Taco de Pool Desarmable Dufferin Grafito', 
 'taco-de-pool-desarmable-dufferin-grafito', 
 'Taco de pool de alta calidad marca Dufferin de 2 piezas, con unión de rosca rápida metálica. Cuerpo de madera de arce canadiense recubierto con una capa protectora de grafito para evitar que se doble por cambios de temperatura y humedad. Suela de cuero de 13mm.', 
 75000.00, 25, 
 ARRAY['https://images.unsplash.com/photo-1577712398418-7ab1a49db2bd?q=80&w=800&auto=format&fit=crop'], 
 true, false, 'ACC-TAC-DUF', 
 '{"Largo": "1.45m", "Suela": "13mm de cuero vacuno", "Unión": "Rosca de acero", "Material": "Madera y Grafito"}'::jsonb),

('30303030-3030-3030-3030-303030303022', '33333333-3333-3333-3333-333333333333', 
 'Triángulo Reglamentario de Madera Maciza', 
 'triangulo-reglamentario-de-madera-maciza', 
 'Triángulo de madera para bolas de pool de 57.2mm de diámetro. Construcción robusta con esquinas reforzadas, acabado brillante en madera natural para combinar con tu mesa.', 
 18000.00, 20, 
 ARRAY['https://images.unsplash.com/photo-1609100096238-3051c5191151?q=80&w=800&auto=format&fit=crop'], 
 true, false, 'ACC-TRI-MAD', 
 '{"Capacidad": "15 bolas de 57.2mm", "Material": "Madera maciza", "Color": "Roble oscuro"}'::jsonb),

-- Category 4: Paños y Tissus
('40404040-4040-4040-4040-404040404020', '44444444-4444-4444-4444-444444444444', 
 'Paño Profesional Tissus Premium Verde Billar', 
 'pano-profesional-tissus-premium-verde-billar', 
 'Paño de calidad profesional para mesas de pool de 8 y 9 pies. Fabricado con una mezcla de 85% lana peinada y 15% nylon que ofrece la mayor velocidad de bola en el juego y resistencia al desgaste por quemaduras de fricción.', 
 98000.00, 10, 
 ARRAY['https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=800&auto=format&fit=crop'], 
 true, true, 'PA-TIS-VER', 
 '{"Composición": "85% Lana, 15% Nylon", "Ancho": "1.65m", "Ideal para": "Mesas de 8 y 9 pies", "Color": "Verde Billar tradicional"}'::jsonb),

('40404040-4040-4040-4040-404040404021', '44444444-4444-4444-4444-444444444444', 
 'Paño Profesional Tissus Premium Azul Royal', 
 'pano-profesional-tissus-premium-azul-royal', 
 'Paño de alta competición en color Azul Royal. Mismo rendimiento que el verde billar tradicional, utilizado frecuentemente en torneos televisados por su alto contraste y excelente estética moderna.', 
 98000.00, 12, 
 ARRAY['https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop'], 
 true, false, 'PA-TIS-AZU', 
 '{"Composición": "85% Lana, 15% Nylon", "Ancho": "1.65m", "Ideal para": "Mesas de 8 y 9 pies", "Color": "Azul Royal de Torneo"}'::jsonb),

('40404040-4040-4040-4040-404040404022', '44444444-4444-4444-4444-444444444444', 
 'Paño Profesional Tissus Premium Rojo Borgoña', 
 'pano-profesional-tissus-premium-rojo-borgona', 
 'Paño de calidad profesional en color Rojo Borgoña. Agrega un toque de distinción y elegancia clásica a tu mesa de pool familiar o sala de juegos comercial.', 
 98000.00, 6, 
 ARRAY['https://images.unsplash.com/photo-1609100096238-3051c5191151?q=80&w=800&auto=format&fit=crop'], 
 true, false, 'PA-TIS-ROJ', '{"Composición": "85% Lana, 15% Nylon", "Ancho": "1.65m", "Ideal para": "Mesas de 8 y 9 pies", "Color": "Rojo Borgoña"}'::jsonb);

-- ─── SETTINGS ───────────────────────────────────────────────────────────────
INSERT INTO store_settings (id, promo_active, promo_min_amount, promo_discount_percentage, promo_installments)
VALUES ('00000000-0000-0000-0000-000000000000', true, 120000, 15, 3)
ON CONFLICT (id) DO NOTHING;
