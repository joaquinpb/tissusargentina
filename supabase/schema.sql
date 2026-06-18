-- ─── TABLAS ──────────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  image_url   text,
  position    integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  description     text,
  price           numeric(12,2),
  stock           integer NOT NULL DEFAULT 0,
  images          text[] NOT NULL DEFAULT '{}',
  is_active       boolean NOT NULL DEFAULT true,
  is_featured     boolean NOT NULL DEFAULT false,
  sku             text,
  specifications  jsonb DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE contact_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id  uuid REFERENCES products(id) ON DELETE SET NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'contacted', 'closed')),
  admin_notes text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── TRIGGERS updated_at ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER on_contact_requests_updated
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- ─── TRIGGER auto-perfil en registro ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Categorías: lectura pública, escritura solo admin
CREATE POLICY "public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "admin manage categories"
  ON categories FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Productos: activos son públicos; admin gestiona todos
CREATE POLICY "public read active products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "admin manage products"
  ON products FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Perfil: usuario gestiona el suyo; admin lee todos
CREATE POLICY "user manage own profile"
  ON profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "admin read all profiles"
  ON profiles FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Consultas: INSERT para todos; SELECT para dueño o admin; UPDATE/DELETE solo admin
CREATE POLICY "anyone insert contact request"
  ON contact_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "owner read own requests"
  ON contact_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "admin manage requests"
  ON contact_requests FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─── STORAGE ─────────────────────────────────────────────────────────────────
-- Ejecutar desde Dashboard > Storage > New Bucket:
-- Nombre: "tissus-images", Public: true
-- O con este comando SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('tissus-images', 'tissus-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read tissus-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tissus-images');

CREATE POLICY "admin upload tissus-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'tissus-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "admin delete tissus-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'tissus-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
