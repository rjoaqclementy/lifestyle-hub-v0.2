-- Populate countries
INSERT INTO countries (code, name) VALUES
('US', 'United States'),
('GB', 'United Kingdom'),
('ES', 'Spain'),
('FR', 'France'),
('DE', 'Germany'),
('IT', 'Italy'),
('BR', 'Brazil'),
('AR', 'Argentina'),
('PE', 'Peru'),
('MX', 'Mexico'),
('CA', 'Canada'),
('AU', 'Australia'),
('JP', 'Japan'),
('CN', 'China'),
('IN', 'India')
ON CONFLICT (code) DO NOTHING;

-- Populate cities for United States
INSERT INTO cities (country_code, name) VALUES
('US', 'New York City'),
('US', 'Los Angeles'),
('US', 'Chicago'),
('US', 'Houston'),
('US', 'Phoenix'),
('US', 'Philadelphia'),
('US', 'San Antonio'),
('US', 'San Diego'),
('US', 'Dallas'),
('US', 'San Jose'),
('US', 'Miami'),
('US', 'Seattle'),
('US', 'Boston'),
('US', 'Denver'),
('US', 'Atlanta');

-- Populate cities for United Kingdom
INSERT INTO cities (country_code, name) VALUES
('GB', 'London'),
('GB', 'Birmingham'),
('GB', 'Leeds'),
('GB', 'Glasgow'),
('GB', 'Sheffield'),
('GB', 'Manchester'),
('GB', 'Edinburgh'),
('GB', 'Liverpool'),
('GB', 'Bristol'),
('GB', 'Cardiff');

-- Populate cities for Spain
INSERT INTO cities (country_code, name) VALUES
('ES', 'Madrid'),
('ES', 'Barcelona'),
('ES', 'Valencia'),
('ES', 'Seville'),
('ES', 'Zaragoza'),
('ES', 'Málaga'),
('ES', 'Murcia'),
('ES', 'Palma de Mallorca'),
('ES', 'Las Palmas'),
('ES', 'Bilbao');

-- Populate cities for France
INSERT INTO cities (country_code, name) VALUES
('FR', 'Paris'),
('FR', 'Marseille'),
('FR', 'Lyon'),
('FR', 'Toulouse'),
('FR', 'Nice'),
('FR', 'Nantes'),
('FR', 'Strasbourg'),
('FR', 'Montpellier'),
('FR', 'Bordeaux'),
('FR', 'Lille');

-- Populate cities for Germany
INSERT INTO cities (country_code, name) VALUES
('DE', 'Berlin'),
('DE', 'Hamburg'),
('DE', 'Munich'),
('DE', 'Cologne'),
('DE', 'Frankfurt'),
('DE', 'Stuttgart'),
('DE', 'Düsseldorf'),
('DE', 'Leipzig'),
('DE', 'Dortmund'),
('DE', 'Dresden');

-- Populate cities for Italy
INSERT INTO cities (country_code, name) VALUES
('IT', 'Rome'),
('IT', 'Milan'),
('IT', 'Naples'),
('IT', 'Turin'),
('IT', 'Palermo'),
('IT', 'Genoa'),
('IT', 'Bologna'),
('IT', 'Florence'),
('IT', 'Venice'),
('IT', 'Verona');

-- Populate cities for Brazil
INSERT INTO cities (country_code, name) VALUES
('BR', 'São Paulo'),
('BR', 'Rio de Janeiro'),
('BR', 'Brasília'),
('BR', 'Salvador'),
('BR', 'Fortaleza'),
('BR', 'Belo Horizonte'),
('BR', 'Manaus'),
('BR', 'Curitiba'),
('BR', 'Recife'),
('BR', 'Porto Alegre');

-- Populate cities for Argentina
INSERT INTO cities (country_code, name) VALUES
('AR', 'Buenos Aires'),
('AR', 'Córdoba'),
('AR', 'Rosario'),
('AR', 'Mendoza'),
('AR', 'Salta'),
('AR', 'Mar del Plata'),
('AR', 'Santa Fe'),
('AR', 'Santiago del Estero'),
('AR', 'Neuquén'),
('AR', 'Río Grande');

-- Populate cities for Peru
INSERT INTO cities (country_code, name) VALUES
('PE', 'Lima'),
('PE', 'Arequipa'),
('PE', 'Trujillo'),
('PE', 'Cusco'),
('PE', 'Piura'),
('PE', 'Chiclayo'),
('PE', 'Iquitos'),
('PE', 'Huancayo'),
('PE', 'Tacna'),
('PE', 'Cajamarca');

-- Populate cities for Mexico
INSERT INTO cities (country_code, name) VALUES
('MX', 'Mexico City'),
('MX', 'Guadalajara'),
('MX', 'Monterrey'),
('MX', 'Puebla'),
('MX', 'Tijuana'),
('MX', 'León'),
('MX', 'Juárez'),
('MX', 'Cancún'),
('MX', 'Mérida'),
('MX', 'Acapulco');

-- Populate cities for Canada
INSERT INTO cities (country_code, name) VALUES
('CA', 'Toronto'),
('CA', 'Montreal'),
('CA', 'Vancouver'),
('CA', 'Calgary'),
('CA', 'Edmonton'),
('CA', 'Ottawa'),
('CA', 'Quebec City'),
('CA', 'Winnipeg'),
('CA', 'Halifax'),
('CA', 'Victoria');

-- Populate cities for Australia
INSERT INTO cities (country_code, name) VALUES
('AU', 'Sydney'),
('AU', 'Melbourne'),
('AU', 'Brisbane'),
('AU', 'Perth'),
('AU', 'Adelaide'),
('AU', 'Gold Coast'),
('AU', 'Canberra'),
('AU', 'Newcastle'),
('AU', 'Darwin'),
('AU', 'Hobart');

-- Populate cities for Japan
INSERT INTO cities (country_code, name) VALUES
('JP', 'Tokyo'),
('JP', 'Yokohama'),
('JP', 'Osaka'),
('JP', 'Nagoya'),
('JP', 'Sapporo'),
('JP', 'Fukuoka'),
('JP', 'Kobe'),
('JP', 'Kyoto'),
('JP', 'Kawasaki'),
('JP', 'Hiroshima');

-- Populate cities for China
INSERT INTO cities (country_code, name) VALUES
('CN', 'Shanghai'),
('CN', 'Beijing'),
('CN', 'Guangzhou'),
('CN', 'Shenzhen'),
('CN', 'Chengdu'),
('CN', 'Tianjin'),
('CN', 'Wuhan'),
('CN', 'Xian'),
('CN', 'Hangzhou'),
('CN', 'Nanjing');

-- Populate cities for India
INSERT INTO cities (country_code, name) VALUES
('IN', 'Mumbai'),
('IN', 'Delhi'),
('IN', 'Bangalore'),
('IN', 'Hyderabad'),
('IN', 'Chennai'),
('IN', 'Kolkata'),
('IN', 'Pune'),
('IN', 'Ahmedabad'),
('IN', 'Jaipur'),
('IN', 'Lucknow');