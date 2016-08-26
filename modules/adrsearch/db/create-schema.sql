CREATE SCHEMA adrsearch;
CREATE TABLE adrsearch.addressaccess
(
  addressaccessid character varying NOT NULL,
  streetname character varying,
  streetbuildingidentifier character varying,
  postcodeidentifier character varying,
  districtname character varying,
  presentationstring character varying,
  geometrywkt character varying,
  sortorder int,
  json character varying,
  CONSTRAINT addressaccess_pkey PRIMARY KEY (addressaccessid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE adrsearch.addressaccess
  OWNER TO postgres;

CREATE INDEX "addressaccess_streetname_postcodeIdentifier_sortorder_idx"
  ON adrsearch.addressaccess
  USING btree
  (streetname, postcodeidentifier, sortorder);

CREATE INDEX addressaccess_streetname_postcodei_streetbuildingidentifier_idx
  ON adrsearch.addressaccess
  USING btree
  (streetname, postcodeidentifier, streetbuildingidentifier);

CREATE TABLE adrsearch.streetname
(
  id character varying NOT NULL,
  streetname character varying,
  postcodeidentifier character varying,
  districtname character varying,
  presentationstring character varying,
  CONSTRAINT streetname_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE adrsearch.streetname
  OWNER TO postgres;

-- Index: adrsearch.streetname_streetname_postcodeidentifier_idx

-- DROP INDEX adrsearch.streetname_streetname_postcodeidentifier_idx;

CREATE INDEX streetname_streetname_postcodeidentifier_idx
  ON adrsearch.streetname
  USING btree
  (streetname, postcodeidentifier);
