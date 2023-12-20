CREATE DATABASE favsdb;

\c favsdb

CREATE USER favs_user WITH PASSWORD 'favs_password';

GRANT ALL PRIVILEGES ON DATABASE favsdb TO favs_user;

\q
