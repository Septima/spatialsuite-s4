SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE SCHEMA s4;

SET search_path = s4, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE datasource (
    id character varying NOT NULL,
    featurecount integer DEFAULT 0,
    featuretypesingle character varying,
    featuretypeplural character varying
);

ALTER TABLE ONLY datasource
    ADD CONSTRAINT datasource_idx PRIMARY KEY (id);

CREATE TABLE feature (
    datasource character varying(255),
    featureid character varying NOT NULL,
    title character varying NOT NULL,
    description character varying,
    searchstring character varying,
    wkt character varying,
    json character varying
);

ALTER TABLE ONLY feature
    ADD CONSTRAINT fid_idx PRIMARY KEY (datasource, featureid);

CREATE INDEX f_id_ds_idx ON feature USING btree (featureid, datasource);

CREATE TABLE featureterm (
    featureid character varying NOT NULL,
    level integer,
    term character varying NOT NULL,
    datasource character varying
);

CREATE INDEX ft_term_idx ON featureterm USING btree (term);

ALTER TABLE ONLY feature
    ADD CONSTRAINT fk_datasource FOREIGN KEY (datasource) REFERENCES datasource(id);

REVOKE ALL ON SCHEMA s4 FROM PUBLIC;

REVOKE ALL ON TABLE datasource FROM PUBLIC;

REVOKE ALL ON TABLE feature FROM PUBLIC;

