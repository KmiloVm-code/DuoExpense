CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear la tabla de usuarios
CREATE TABLE Usuario (
    id_usuario UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pass TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de ingresos fijos
CREATE TABLE Ingreso (
    id_ingreso SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL
);

-- Crear la tabla de ingresos adicionales
CREATE TABLE IngresoAdicional (
    id_ingreso_adicional SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL
);

-- Crear la tabla de métodos de pago
CREATE TABLE MetodoPago (
    id_metodo_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Crear la tabla de entidades bancarias
CREATE TABLE EntidadBancaria (
    id_entidad_bancaria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Crear la tabla de tarjetas de crédito
CREATE TABLE Tarjeta (
    id_tarjeta SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_entidad_bancaria INT REFERENCES EntidadBancaria(id_entidad_bancaria) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL
);

-- Crear la tabla de categorías de gasto
CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Crear la tabla de gastos
CREATE TABLE Gasto (
    id_gasto SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    concepto VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT,
    id_metodo_pago INT REFERENCES MetodoPago(id_metodo_pago) ON DELETE SET NULL,
    id_tarjeta INT REFERENCES Tarjeta(id_tarjeta) ON DELETE SET NULL,
    cuotas INT CHECK ((id_metodo_pago = 1 AND cuotas IS NOT NULL) OR (id_metodo_pago != 1 AND cuotas IS NULL)),
    valor DECIMAL(10,2) NOT NULL,
    empresa VARCHAR(100),
    id_categoria INT REFERENCES Categoria(id_categoria) ON DELETE SET NULL,
    gasto_fijo BOOLEAN NOT NULL
);

-- Crear la tabla de ahorros
CREATE TABLE Ahorro (
    id_ahorro SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descripcion TEXT
);

-- Insertar métodos de pago por defecto
INSERT INTO MetodoPago (nombre) VALUES ('Tarjeta de Crédito'), ('Efectivo'), ('Transferencia Bancaria');

-- Insertar categorías de gasto por defecto
INSERT INTO Categoria (nombre) VALUES ('Alimentación'), ('Transporte'), ('Entretenimiento'), ('Salud'), ('Educación'), ('Hogar');

-- Insertar entidades bancarias por defecto
INSERT INTO EntidadBancaria (nombre) VALUES ('Bancolombia'), ('Davivienda'), ('Banco de Bogotá'), ('Banco de Occidente'), ('Banco Popular');