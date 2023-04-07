create table equipos(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    equipo varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora time,
    fechas date,
    primary key (id)
)ENGINE=InnoDB;

create table administrativos(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora time,
    fechas date,
    primary key (id)
)ENGINE=InnoDB;

create table equiposh(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    equipo varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora time,
    fechas date,
    primary key (id)
)ENGINE=InnoDB;


create table administrativosh(
    id bigint(255) not null auto_increment,
    nombre varchar(255),
    lab varchar(255),
    materia varchar(255),
    incidencia varchar(255),
    hora time,
    fechas date,
    primary key (id)
)ENGINE=InnoDB;

create table users(
    id int not null auto_increment,
    user_name varchar(255) not null,
    pass varchar(255) not null,
    user_type int not null,
    primary key (id)
)ENGINE=InnoDB;