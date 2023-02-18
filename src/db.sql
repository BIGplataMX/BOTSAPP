create table equipos(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    equipo varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora varchar(255),
    fechas varchar(255),
    primary key (id)
)ENGINE=InnoDB;

create table administrativos(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora varchar(255),
    fechas varchar(255),
    primary key (id)
)ENGINE=InnoDB;