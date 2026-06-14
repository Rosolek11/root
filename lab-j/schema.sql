DROP TABLE IF EXISTS car;

CREATE TABLE car (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    production_year INTEGER NOT NULL,
    fuel_type TEXT NOT NULL,
    horsepower INTEGER NOT NULL
);

INSERT INTO car (brand, model, production_year, fuel_type, horsepower) VALUES
    ('Toyota', 'Corolla', 2022, 'Benzyna', 140),
    ('Volkswagen', 'Golf', 2021, 'Benzyna', 150),
    ('BMW', 'Seria 3', 2020, 'Diesel', 190),
    ('Skoda', 'Octavia', 2023, 'Hybryda', 204),
    ('Ford', 'Mustang', 2019, 'Benzyna', 450),
    ('Tesla', 'Model 3', 2024, 'Elektryczny', 283);

