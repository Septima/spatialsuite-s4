CREATE TABLE datasource (id nvarchar(255) NOT NULL, featurecount integer DEFAULT 0, featuretypesingle nvarchar(255), featuretypeplural nvarchar(255));
CREATE TABLE feature (datasource nvarchar(255), featureid varchar(255) NOT NULL, title nvarchar(255) NOT NULL, description nvarchar(255), searchstring nvarchar(MAX), wkt nvarchar(MAX), json nvarchar(MAX));
CREATE TABLE featureterm (featureid nvarchar(255) NOT NULL, level integer, term nvarchar(255) NOT NULL, datasource nvarchar(255));
CREATE INDEX f_id_ds_idx ON feature (featureid, datasource);
CREATE INDEX ft_term_idx ON featureterm (term);
CREATE INDEX sft_fid_term_idx ON featureterm (featureid, term);
CREATE INDEX f_feature_idx ON feature (featureid);
CREATE INDEX f_dat_feature_idx ON feature (datasource, featureid);
