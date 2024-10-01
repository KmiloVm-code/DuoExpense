CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Usuario (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    pass VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IngresoFijo (
    id_ingreso_fijo SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario),
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL
);

CREATE TABLE IngresoAdicional (
    id_ingreso_adicional SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario),
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL
);

CREATE TABLE MetodoPago (
    id_metodo_pago SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE EntidadBancaria (
    id_entidad_bancaria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Tarjeta (
    id_tarjeta SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario),
    id_entidad_bancaria INT REFERENCES EntidadBancaria(id_entidad_bancaria),
    numero_tarjeta VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE Gasto (
    id_gasto SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario),
    concepto VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT,
    id_metodo_pago INT REFERENCES MetodoPago(id_metodo_pago),
    id_tarjeta INT REFERENCES Tarjeta(id_tarjeta),
    cuotas INT CHECK ((id_metodo_pago = 1 AND cuotas IS NOT NULL) OR (id_metodo_pago != 1 AND cuotas IS NULL)),
    valor DECIMAL(10, 2) NOT NULL,
    empresa VARCHAR(100),
    id_categoria INT REFERENCES Categoria(id_categoria),
    gasto_fijo BOOLEAN NOT NULL
);

CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Ahorro (
    id_ahorro SERIAL PRIMARY KEY,
    id_usuario UUID REFERENCES Usuario(id_usuario),
    mes DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL
);
