-- Create countries table
CREATE TABLE public.countries (
    code varchar(2) PRIMARY KEY,
    name varchar(100) NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create cities table
CREATE TABLE public.cities (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    country_code varchar(2) REFERENCES public.countries(code) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_cities_country_code ON public.cities(country_code);
CREATE INDEX idx_cities_name ON public.cities USING gin(name gin_trgm_ops);
CREATE INDEX idx_countries_name ON public.countries USING gin(name gin_trgm_ops);

-- Enable Row Level Security
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to countries" ON public.countries
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to cities" ON public.cities
    FOR SELECT USING (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON countries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON cities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();