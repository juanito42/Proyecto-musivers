--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Ubuntu 14.13-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: doctrine_migration_versions; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.doctrine_migration_versions (
    version character varying(191) NOT NULL,
    executed_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    execution_time integer
);


ALTER TABLE public.doctrine_migration_versions OWNER TO juanito;

--
-- Name: event; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.event (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    date timestamp(0) without time zone NOT NULL,
    photo_filename character varying(255) DEFAULT NULL::character varying,
    url character varying(255) DEFAULT NULL::character varying,
    category character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.event OWNER TO juanito;

--
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: juanito
--

ALTER TABLE public.event ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: forums; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.forums (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.forums OWNER TO juanito;

--
-- Name: forums_id_seq; Type: SEQUENCE; Schema: public; Owner: juanito
--

ALTER TABLE public.forums ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.forums_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.profile (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    bio text,
    birth_date date,
    user_id integer NOT NULL
);


ALTER TABLE public.profile OWNER TO juanito;

--
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: juanito
--

ALTER TABLE public.profile ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: response_entity; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.response_entity (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    forum_id integer NOT NULL,
    parent_response_id integer
);


ALTER TABLE public.response_entity OWNER TO juanito;

--
-- Name: response_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: juanito
--

ALTER TABLE public.response_entity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.response_entity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: juanito
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO juanito;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: juanito
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: doctrine_migration_versions; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.doctrine_migration_versions (version, executed_at, execution_time) FROM stdin;
DoctrineMigrations\\Version20241020192934	2024-10-20 21:30:07	52
DoctrineMigrations\\Version20241020192951	2024-10-21 22:23:34	2
DoctrineMigrations\\Version20241021201731	2024-10-21 22:23:34	6
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.event (id, title, description, date, photo_filename, url, category) FROM stdin;
6	eeee	eeeee	2019-01-01 00:00:00	6716bb19401d3.webp	\N	Rock
7	sss	sssss	2019-01-01 00:00:00	\N	\N	Rock
8	ddddddddddddddddd	dddddddddddddddddd	2019-01-01 00:00:00	\N	\N	Rock
\.


--
-- Data for Name: forums; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.forums (id, title, description) FROM stdin;
1	cdscsdc	csc
2	scscsc	scscs
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.profile (id, first_name, last_name, bio, birth_date, user_id) FROM stdin;
\.


--
-- Data for Name: response_entity; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.response_entity (id, content, created_at, forum_id, parent_response_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: juanito
--

COPY public.users (id, email, password) FROM stdin;
1	juan@gmail.com	$2y$13$fUWhs9kM6UTesYs8US7F/ODyYTDwoWwioBR1ZV5wgnhdjpg5Nu6ri
\.


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juanito
--

SELECT pg_catalog.setval('public.event_id_seq', 8, true);


--
-- Name: forums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juanito
--

SELECT pg_catalog.setval('public.forums_id_seq', 2, true);


--
-- Name: profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juanito
--

SELECT pg_catalog.setval('public.profile_id_seq', 1, false);


--
-- Name: response_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juanito
--

SELECT pg_catalog.setval('public.response_entity_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: juanito
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: doctrine_migration_versions doctrine_migration_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.doctrine_migration_versions
    ADD CONSTRAINT doctrine_migration_versions_pkey PRIMARY KEY (version);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: forums forums_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_pkey PRIMARY KEY (id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: response_entity response_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.response_entity
    ADD CONSTRAINT response_entity_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_6553634729ccbad0; Type: INDEX; Schema: public; Owner: juanito
--

CREATE INDEX idx_6553634729ccbad0 ON public.response_entity USING btree (forum_id);


--
-- Name: idx_6553634790df3a30; Type: INDEX; Schema: public; Owner: juanito
--

CREATE INDEX idx_6553634790df3a30 ON public.response_entity USING btree (parent_response_id);


--
-- Name: uniq_1483a5e9e7927c74; Type: INDEX; Schema: public; Owner: juanito
--

CREATE UNIQUE INDEX uniq_1483a5e9e7927c74 ON public.users USING btree (email);


--
-- Name: uniq_8157aa0fa76ed395; Type: INDEX; Schema: public; Owner: juanito
--

CREATE UNIQUE INDEX uniq_8157aa0fa76ed395 ON public.profile USING btree (user_id);


--
-- Name: response_entity fk_6553634729ccbad0; Type: FK CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.response_entity
    ADD CONSTRAINT fk_6553634729ccbad0 FOREIGN KEY (forum_id) REFERENCES public.forums(id);


--
-- Name: response_entity fk_6553634790df3a30; Type: FK CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.response_entity
    ADD CONSTRAINT fk_6553634790df3a30 FOREIGN KEY (parent_response_id) REFERENCES public.response_entity(id);


--
-- Name: profile fk_8157aa0fa76ed395; Type: FK CONSTRAINT; Schema: public; Owner: juanito
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT fk_8157aa0fa76ed395 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

