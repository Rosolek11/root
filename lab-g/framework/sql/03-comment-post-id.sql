ALTER TABLE comment ADD COLUMN post_id integer not null default 0 references post(id);
