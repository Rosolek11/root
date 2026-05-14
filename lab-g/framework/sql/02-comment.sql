create table comment
(
    id      integer not null
        constraint comment_pk
            primary key autoincrement,
    post_id integer not null,
    author  text not null,
    content text not null
);

