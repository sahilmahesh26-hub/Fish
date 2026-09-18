import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_section_intro_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_section_intro_alignment" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_media_copy_split_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_media_copy_split_media_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum_pages_blocks_media_copy_split_media_shape" AS ENUM('pool', 'oval', 'rect');
  CREATE TYPE "public"."enum_pages_blocks_media_copy_split_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_process_route_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_process_route_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_mode" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_specimen_record_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_specimen_record_record_media_status" AS ENUM('confirmed', 'partial', 'pending');
  CREATE TYPE "public"."enum_pages_blocks_delivery_stories_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_delivery_stories_mode" AS ENUM('featured', 'selected');
  CREATE TYPE "public"."enum_pages_blocks_delivery_stories_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum_pages_blocks_delivery_stories_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_aquarium_feature_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_video_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_video_source" AS ENUM('upload', 'external');
  CREATE TYPE "public"."enum_pages_blocks_trust_statements_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_featured_articles_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_featured_articles_mode" AS ENUM('latest', 'selected');
  CREATE TYPE "public"."enum_pages_blocks_featured_articles_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum_pages_blocks_featured_articles_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_faqs_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_faqs_mode" AS ENUM('category', 'selected');
  CREATE TYPE "public"."enum_pages_blocks_faqs_category" AS ENUM('sourcing', 'delivery', 'pricing', 'aquariums', 'general');
  CREATE TYPE "public"."enum_pages_blocks_cta_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_pages_blocks_cta_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_blocks_cta_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('standard', 'policy', 'utility');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_section_intro_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_section_intro_alignment" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_media_copy_split_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_media_copy_split_media_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum__pages_v_blocks_media_copy_split_media_shape" AS ENUM('pool', 'oval', 'rect');
  CREATE TYPE "public"."enum__pages_v_blocks_media_copy_split_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_process_route_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_process_route_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_mode" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_specimen_record_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_specimen_record_record_media_status" AS ENUM('confirmed', 'partial', 'pending');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_stories_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_stories_mode" AS ENUM('featured', 'selected');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_stories_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum__pages_v_blocks_delivery_stories_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_aquarium_feature_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_video_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_video_source" AS ENUM('upload', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_trust_statements_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_articles_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_articles_mode" AS ENUM('latest', 'selected');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_articles_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_articles_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_mode" AS ENUM('category', 'selected');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_category" AS ENUM('sourcing', 'delivery', 'pricing', 'aquariums', 'general');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('standard', 'policy', 'utility');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_deliveries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__deliveries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_aquarium_projects_service_type" AS ENUM('service', 'project');
  CREATE TYPE "public"."enum_aquarium_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__aquarium_projects_v_version_service_type" AS ENUM('service', 'project');
  CREATE TYPE "public"."enum__aquarium_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('sourcing', 'delivery', 'pricing', 'aquariums', 'general');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'reviewing', 'sourcing', 'options-shared', 'approved', 'closed', 'unsuccessful');
  CREATE TYPE "public"."enum_enquiries_alternatives_accepted" AS ENUM('yes', 'no', 'describe');
  CREATE TYPE "public"."enum_enquiries_tank_cycled" AS ENUM('yes', 'no', 'unsure', 'new-system');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'editor');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_homepage_blocks_section_intro_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_section_intro_alignment" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_homepage_blocks_process_route_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_process_route_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_category_grid_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_category_grid_mode" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum_homepage_blocks_category_grid_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_specimen_record_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_specimen_record_record_media_status" AS ENUM('confirmed', 'partial', 'pending');
  CREATE TYPE "public"."enum_homepage_blocks_trust_statements_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_delivery_stories_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_delivery_stories_mode" AS ENUM('featured', 'selected');
  CREATE TYPE "public"."enum_homepage_blocks_delivery_stories_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum_homepage_blocks_delivery_stories_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_aquarium_feature_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_featured_articles_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_featured_articles_mode" AS ENUM('latest', 'selected');
  CREATE TYPE "public"."enum_homepage_blocks_featured_articles_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum_homepage_blocks_featured_articles_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_faqs_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_faqs_mode" AS ENUM('category', 'selected');
  CREATE TYPE "public"."enum_homepage_blocks_faqs_category" AS ENUM('sourcing', 'delivery', 'pricing', 'aquariums', 'general');
  CREATE TYPE "public"."enum_homepage_blocks_media_copy_split_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_media_copy_split_media_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum_homepage_blocks_media_copy_split_media_shape" AS ENUM('pool', 'oval', 'rect');
  CREATE TYPE "public"."enum_homepage_blocks_media_copy_split_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_rich_text_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_homepage_blocks_image_gallery_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_video_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_video_source" AS ENUM('upload', 'external');
  CREATE TYPE "public"."enum_homepage_blocks_cta_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum_homepage_blocks_cta_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_blocks_cta_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_hero_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_hero_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_blocks_section_intro_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_section_intro_alignment" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum__homepage_v_blocks_process_route_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_process_route_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_category_grid_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_category_grid_mode" AS ENUM('all', 'selected');
  CREATE TYPE "public"."enum__homepage_v_blocks_category_grid_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_specimen_record_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_specimen_record_record_media_status" AS ENUM('confirmed', 'partial', 'pending');
  CREATE TYPE "public"."enum__homepage_v_blocks_trust_statements_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_delivery_stories_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_delivery_stories_mode" AS ENUM('featured', 'selected');
  CREATE TYPE "public"."enum__homepage_v_blocks_delivery_stories_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum__homepage_v_blocks_delivery_stories_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_aquarium_feature_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_featured_articles_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_featured_articles_mode" AS ENUM('latest', 'selected');
  CREATE TYPE "public"."enum__homepage_v_blocks_featured_articles_empty_state_behaviour" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum__homepage_v_blocks_featured_articles_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_faqs_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_faqs_mode" AS ENUM('category', 'selected');
  CREATE TYPE "public"."enum__homepage_v_blocks_faqs_category" AS ENUM('sourcing', 'delivery', 'pricing', 'aquariums', 'general');
  CREATE TYPE "public"."enum__homepage_v_blocks_media_copy_split_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_media_copy_split_media_position" AS ENUM('start', 'end');
  CREATE TYPE "public"."enum__homepage_v_blocks_media_copy_split_media_shape" AS ENUM('pool', 'oval', 'rect');
  CREATE TYPE "public"."enum__homepage_v_blocks_media_copy_split_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_rich_text_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__homepage_v_blocks_image_gallery_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_video_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_video_source" AS ENUM('upload', 'external');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_background" AS ENUM('linen', 'linen-raised', 'navy', 'scarlet');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_version_hero_primary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_version_hero_secondary_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'facebook', 'youtube', 'x', 'whatsapp');
  CREATE TYPE "public"."enum_site_settings_analytics_provider" AS ENUM('none', 'plausible', 'umami', 'ga4');
  CREATE TYPE "public"."enum_header_cta_type" AS ENUM('internal', 'external', 'whatsapp');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" varchar,
  	"trust_line" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum_pages_blocks_hero_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum_pages_blocks_hero_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"fish_image_id" integer,
  	"annotation" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_section_intro_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"alignment" "enum_pages_blocks_section_intro_alignment" DEFAULT 'start',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_rich_text_background" DEFAULT 'linen',
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_copy_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_media_copy_split_background" DEFAULT 'linen',
  	"media_position" "enum_pages_blocks_media_copy_split_media_position" DEFAULT 'end',
  	"media_shape" "enum_pages_blocks_media_copy_split_media_shape" DEFAULT 'pool',
  	"media_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_media_copy_split_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_route_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "pages_blocks_process_route" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_process_route_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_process_route_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_category_grid_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_pages_blocks_category_grid_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_category_grid_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_specimen_record_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_specimen_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_specimen_record_background" DEFAULT 'linen-raised',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"note" varchar,
  	"main_image_id" integer,
  	"record_request_id" varchar,
  	"record_measurement" varchar,
  	"record_origin" varchar,
  	"record_media_status" "enum_pages_blocks_specimen_record_record_media_status",
  	"record_notes" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_delivery_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_delivery_stories_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_pages_blocks_delivery_stories_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum_pages_blocks_delivery_stories_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_delivery_stories_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_aquarium_feature_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_aquarium_feature_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_aquarium_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"main_image_id" integer,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_aquarium_feature_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_image_gallery_background" DEFAULT 'linen',
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_video_background" DEFAULT 'linen',
  	"heading" varchar,
  	"source" "enum_pages_blocks_video_source" DEFAULT 'upload',
  	"file_id" integer,
  	"url" varchar,
  	"poster_id" integer,
  	"captions_track_id" integer,
  	"transcript" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_statements_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_statements_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_trust_statements_background" DEFAULT 'navy',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_featured_articles_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_pages_blocks_featured_articles_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum_pages_blocks_featured_articles_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_featured_articles_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_faqs_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum_pages_blocks_faqs_mode" DEFAULT 'category',
  	"category" "enum_pages_blocks_faqs_category",
  	"emit_structured_data" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_pages_blocks_cta_background" DEFAULT 'scarlet',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum_pages_blocks_cta_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum_pages_blocks_cta_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"page_type" "enum_pages_page_type" DEFAULT 'standard',
  	"legal_review_required" boolean DEFAULT false,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_intro" varchar,
  	"hero_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"show_in_navigation" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sourcing_categories_id" integer,
  	"deliveries_id" integer,
  	"posts_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" varchar,
  	"trust_line" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum__pages_v_blocks_hero_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum__pages_v_blocks_hero_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"fish_image_id" integer,
  	"annotation" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_section_intro_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"alignment" "enum__pages_v_blocks_section_intro_alignment" DEFAULT 'start',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_rich_text_background" DEFAULT 'linen',
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_copy_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_media_copy_split_background" DEFAULT 'linen',
  	"media_position" "enum__pages_v_blocks_media_copy_split_media_position" DEFAULT 'end',
  	"media_shape" "enum__pages_v_blocks_media_copy_split_media_shape" DEFAULT 'pool',
  	"media_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_media_copy_split_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_route_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_route" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_process_route_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_process_route_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_category_grid_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__pages_v_blocks_category_grid_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_category_grid_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_specimen_record_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_specimen_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_specimen_record_background" DEFAULT 'linen-raised',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"note" varchar,
  	"main_image_id" integer,
  	"record_request_id" varchar,
  	"record_measurement" varchar,
  	"record_origin" varchar,
  	"record_media_status" "enum__pages_v_blocks_specimen_record_record_media_status",
  	"record_notes" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_delivery_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_delivery_stories_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__pages_v_blocks_delivery_stories_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum__pages_v_blocks_delivery_stories_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_delivery_stories_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_aquarium_feature_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_aquarium_feature_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_aquarium_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"main_image_id" integer,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_aquarium_feature_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_image_gallery_background" DEFAULT 'linen',
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_video_background" DEFAULT 'linen',
  	"heading" varchar,
  	"source" "enum__pages_v_blocks_video_source" DEFAULT 'upload',
  	"file_id" integer,
  	"url" varchar,
  	"poster_id" integer,
  	"captions_track_id" integer,
  	"transcript" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_statements_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_statements_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_trust_statements_background" DEFAULT 'navy',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_featured_articles_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__pages_v_blocks_featured_articles_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum__pages_v_blocks_featured_articles_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_featured_articles_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_faqs_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum__pages_v_blocks_faqs_mode" DEFAULT 'category',
  	"category" "enum__pages_v_blocks_faqs_category",
  	"emit_structured_data" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__pages_v_blocks_cta_background" DEFAULT 'scarlet',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum__pages_v_blocks_cta_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum__pages_v_blocks_cta_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_page_type" "enum__pages_v_version_page_type" DEFAULT 'standard',
  	"version_legal_review_required" boolean DEFAULT false,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_show_in_navigation" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sourcing_categories_id" integer,
  	"deliveries_id" integer,
  	"posts_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"category_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"parent_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sourcing_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"long_description" jsonb,
  	"cover_media_id" integer,
  	"availability_label" varchar DEFAULT 'Sourced on request' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "deliveries_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "deliveries_packing_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "deliveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"request_id" varchar,
  	"requirement" varchar,
  	"specimen" varchar,
  	"category_id" integer,
  	"variety" varchar,
  	"approximate_size" varchar,
  	"origin" varchar,
  	"destination" varchar,
  	"outcome" jsonb,
  	"main_image_id" integer,
  	"testimonial" varchar,
  	"testimonial_attribution" varchar,
  	"testimonial_consent" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"delivery_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_deliveries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_deliveries_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_deliveries_v_version_packing_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_deliveries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_request_id" varchar,
  	"version_requirement" varchar,
  	"version_specimen" varchar,
  	"version_category_id" integer,
  	"version_variety" varchar,
  	"version_approximate_size" varchar,
  	"version_origin" varchar,
  	"version_destination" varchar,
  	"version_outcome" jsonb,
  	"version_main_image_id" integer,
  	"version_testimonial" varchar,
  	"version_testimonial_attribution" varchar,
  	"version_testimonial_consent" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_delivery_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__deliveries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "aquarium_projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "aquarium_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"cover_media_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"service_type" "enum_aquarium_projects_service_type" DEFAULT 'service',
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_aquarium_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_aquarium_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_aquarium_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_cover_media_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_service_type" "enum__aquarium_projects_v_version_service_type" DEFAULT 'service',
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__aquarium_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_name" varchar NOT NULL,
  	"city" varchar,
  	"quote" varchar NOT NULL,
  	"related_delivery_id" integer,
  	"consent" boolean DEFAULT false,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'general' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_id" varchar NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"assigned_to_id" integer,
  	"full_name" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"email" varchar,
  	"city" varchar NOT NULL,
  	"state" varchar NOT NULL,
  	"pincode" varchar NOT NULL,
  	"fish_required" varchar NOT NULL,
  	"species" varchar,
  	"variety" varchar,
  	"preferred_size" varchar,
  	"size_range" varchar,
  	"quantity" numeric,
  	"alternatives_accepted" "enum_enquiries_alternatives_accepted",
  	"alternatives_notes" varchar,
  	"tank_dimensions" varchar,
  	"water_volume" varchar,
  	"tank_inhabitants" varchar,
  	"tank_cycled" "enum_enquiries_tank_cycled",
  	"system_notes" varchar,
  	"budget_range" varchar,
  	"timeline" varchar,
  	"delivery_city" varchar,
  	"delivery_pincode" varchar,
  	"additional_requirements" varchar,
  	"preferred_contact_time" varchar,
  	"reference_image_id" integer,
  	"internal_notes" varchar,
  	"meta_source_page" varchar,
  	"meta_submission_token" varchar,
  	"meta_consent_at" timestamp(3) with time zone,
  	"meta_consent_text" varchar,
  	"meta_utm_source" varchar,
  	"meta_utm_medium" varchar,
  	"meta_utm_campaign" varchar,
  	"meta_utm_term" varchar,
  	"meta_utm_content" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"decorative" boolean DEFAULT false,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"seed_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_social_url" varchar,
  	"sizes_social_width" numeric,
  	"sizes_social_height" numeric,
  	"sizes_social_mime_type" varchar,
  	"sizes_social_filesize" numeric,
  	"sizes_social_filename" varchar
  );
  
  CREATE TABLE "media_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "private_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_request_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_preview_url" varchar,
  	"sizes_preview_width" numeric,
  	"sizes_preview_height" numeric,
  	"sizes_preview_mime_type" varchar,
  	"sizes_preview_filesize" numeric,
  	"sizes_preview_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"can_publish" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"last_login" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"authors_id" integer,
  	"sourcing_categories_id" integer,
  	"deliveries_id" integer,
  	"aquarium_projects_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"enquiries_id" integer,
  	"media_id" integer,
  	"private_media_id" integer,
  	"users_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_section_intro_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"alignment" "enum_homepage_blocks_section_intro_alignment" DEFAULT 'start',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_process_route_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "homepage_blocks_process_route" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_process_route_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_process_route_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_category_grid_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_homepage_blocks_category_grid_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_category_grid_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_specimen_record_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "homepage_blocks_specimen_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_specimen_record_background" DEFAULT 'linen-raised',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"note" varchar,
  	"main_image_id" integer,
  	"record_request_id" varchar,
  	"record_measurement" varchar,
  	"record_origin" varchar,
  	"record_media_status" "enum_homepage_blocks_specimen_record_record_media_status",
  	"record_notes" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_trust_statements_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"copy" varchar
  );
  
  CREATE TABLE "homepage_blocks_trust_statements_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_blocks_trust_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_trust_statements_background" DEFAULT 'navy',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_delivery_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_delivery_stories_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_homepage_blocks_delivery_stories_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum_homepage_blocks_delivery_stories_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_delivery_stories_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_aquarium_feature_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_blocks_aquarium_feature_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_blocks_aquarium_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"main_image_id" integer,
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_aquarium_feature_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_featured_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_featured_articles_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum_homepage_blocks_featured_articles_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum_homepage_blocks_featured_articles_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_featured_articles_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_faqs_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum_homepage_blocks_faqs_mode" DEFAULT 'category',
  	"category" "enum_homepage_blocks_faqs_category",
  	"emit_structured_data" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_media_copy_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_media_copy_split_background" DEFAULT 'linen',
  	"media_position" "enum_homepage_blocks_media_copy_split_media_position" DEFAULT 'end',
  	"media_shape" "enum_homepage_blocks_media_copy_split_media_shape" DEFAULT 'pool',
  	"media_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"cta_type" "enum_homepage_blocks_media_copy_split_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_rich_text_background" DEFAULT 'linen',
  	"width" "enum_homepage_blocks_rich_text_width" DEFAULT 'narrow',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "homepage_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_image_gallery_background" DEFAULT 'linen',
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_video_background" DEFAULT 'linen',
  	"heading" varchar,
  	"source" "enum_homepage_blocks_video_source" DEFAULT 'upload',
  	"file_id" integer,
  	"url" varchar,
  	"poster_id" integer,
  	"captions_track_id" integer,
  	"transcript" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum_homepage_blocks_cta_background" DEFAULT 'scarlet',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum_homepage_blocks_cta_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum_homepage_blocks_cta_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_body" varchar,
  	"hero_trust_line" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_type" "enum_homepage_hero_primary_cta_type" DEFAULT 'internal',
  	"hero_primary_cta_href" varchar,
  	"hero_primary_cta_url" varchar,
  	"hero_primary_cta_whatsapp_message" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_type" "enum_homepage_hero_secondary_cta_type" DEFAULT 'internal',
  	"hero_secondary_cta_href" varchar,
  	"hero_secondary_cta_url" varchar,
  	"hero_secondary_cta_whatsapp_message" varchar,
  	"hero_fish_image_id" integer,
  	"hero_annotation" varchar,
  	"hero_scroll_hint" varchar DEFAULT 'Scroll to see how it works',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean DEFAULT false,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sourcing_categories_id" integer,
  	"deliveries_id" integer,
  	"posts_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_homepage_v_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_section_intro_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"alignment" "enum__homepage_v_blocks_section_intro_alignment" DEFAULT 'start',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process_route_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process_route" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_process_route_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_process_route_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_category_grid_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__homepage_v_blocks_category_grid_mode" DEFAULT 'all',
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_category_grid_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_specimen_record_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_specimen_record" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_specimen_record_background" DEFAULT 'linen-raised',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"note" varchar,
  	"main_image_id" integer,
  	"record_request_id" varchar,
  	"record_measurement" varchar,
  	"record_origin" varchar,
  	"record_media_status" "enum__homepage_v_blocks_specimen_record_record_media_status",
  	"record_notes" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_trust_statements_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"copy" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_trust_statements_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_trust_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_trust_statements_background" DEFAULT 'navy',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_delivery_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_delivery_stories_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__homepage_v_blocks_delivery_stories_mode" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum__homepage_v_blocks_delivery_stories_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_delivery_stories_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_aquarium_feature_detail_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_aquarium_feature_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_aquarium_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"main_image_id" integer,
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_aquarium_feature_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_featured_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_featured_articles_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mode" "enum__homepage_v_blocks_featured_articles_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 4,
  	"empty_state_heading" varchar,
  	"empty_state_body" varchar,
  	"empty_state_behaviour" "enum__homepage_v_blocks_featured_articles_empty_state_behaviour" DEFAULT 'show',
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_featured_articles_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_faqs_background" DEFAULT 'linen',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum__homepage_v_blocks_faqs_mode" DEFAULT 'category',
  	"category" "enum__homepage_v_blocks_faqs_category",
  	"emit_structured_data" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_media_copy_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_media_copy_split_background" DEFAULT 'linen',
  	"media_position" "enum__homepage_v_blocks_media_copy_split_media_position" DEFAULT 'end',
  	"media_shape" "enum__homepage_v_blocks_media_copy_split_media_shape" DEFAULT 'pool',
  	"media_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"cta_type" "enum__homepage_v_blocks_media_copy_split_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_rich_text_background" DEFAULT 'linen',
  	"width" "enum__homepage_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_image_gallery_background" DEFAULT 'linen',
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_video_background" DEFAULT 'linen',
  	"heading" varchar,
  	"source" "enum__homepage_v_blocks_video_source" DEFAULT 'upload',
  	"file_id" integer,
  	"url" varchar,
  	"poster_id" integer,
  	"captions_track_id" integer,
  	"transcript" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"background" "enum__homepage_v_blocks_cta_background" DEFAULT 'scarlet',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_type" "enum__homepage_v_blocks_cta_primary_cta_type" DEFAULT 'internal',
  	"primary_cta_href" varchar,
  	"primary_cta_url" varchar,
  	"primary_cta_whatsapp_message" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_type" "enum__homepage_v_blocks_cta_secondary_cta_type" DEFAULT 'internal',
  	"secondary_cta_href" varchar,
  	"secondary_cta_url" varchar,
  	"secondary_cta_whatsapp_message" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_body" varchar,
  	"version_hero_trust_line" varchar,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_primary_cta_type" "enum__homepage_v_version_hero_primary_cta_type" DEFAULT 'internal',
  	"version_hero_primary_cta_href" varchar,
  	"version_hero_primary_cta_url" varchar,
  	"version_hero_primary_cta_whatsapp_message" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_hero_secondary_cta_type" "enum__homepage_v_version_hero_secondary_cta_type" DEFAULT 'internal',
  	"version_hero_secondary_cta_href" varchar,
  	"version_hero_secondary_cta_url" varchar,
  	"version_hero_secondary_cta_whatsapp_message" varchar,
  	"version_hero_fish_image_id" integer,
  	"version_hero_annotation" varchar,
  	"version_hero_scroll_hint" varchar DEFAULT 'Scroll to see how it works',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean DEFAULT false,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sourcing_categories_id" integer,
  	"deliveries_id" integer,
  	"posts_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'Finquiry' NOT NULL,
  	"tagline" varchar DEFAULT 'Every Collector Is Searching for Something.',
  	"short_description" varchar,
  	"logo_id" integer,
  	"logo_on_dark_id" integer,
  	"favicon_id" integer,
  	"contact_email" varchar,
  	"whatsapp_number" varchar,
  	"whatsapp_default_message" varchar DEFAULT 'Hello Finquiry, I would like help sourcing a fish. Here is what I am looking for:',
  	"phone" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_postal_code" varchar,
  	"address_country" varchar DEFAULT 'India',
  	"default_seo_title_template" varchar DEFAULT '%s — Finquiry',
  	"default_seo_default_title" varchar,
  	"default_seo_description" varchar,
  	"default_seo_image_id" integer,
  	"organisation_legal_name" varchar,
  	"organisation_founding_year" numeric,
  	"organisation_area_served" varchar DEFAULT 'India',
  	"analytics_provider" "enum_site_settings_analytics_provider" DEFAULT 'none',
  	"analytics_measurement_id" varchar,
  	"analytics_script_url" varchar,
  	"consent_enabled" boolean DEFAULT false,
  	"consent_message" varchar DEFAULT 'We use a small amount of anonymous analytics to understand how the site is used.',
  	"consent_policy_link" varchar DEFAULT '/privacy-policy',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar,
  	"cta_type" "enum_header_cta_type" DEFAULT 'internal',
  	"cta_href" varchar,
  	"cta_url" varchar,
  	"cta_whatsapp_message" varchar,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_text" varchar,
  	"announcement_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_nav_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_nav_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_statement" varchar,
  	"show_contact_details" boolean DEFAULT true,
  	"copyright_format" varchar DEFAULT '© {year} {brand}. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_fish_image_id_media_id_fk" FOREIGN KEY ("fish_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section_intro" ADD CONSTRAINT "pages_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_copy_split" ADD CONSTRAINT "pages_blocks_media_copy_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_copy_split" ADD CONSTRAINT "pages_blocks_media_copy_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_route_steps" ADD CONSTRAINT "pages_blocks_process_route_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_route"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_route" ADD CONSTRAINT "pages_blocks_process_route_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specimen_record_detail_images" ADD CONSTRAINT "pages_blocks_specimen_record_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_specimen_record_detail_images" ADD CONSTRAINT "pages_blocks_specimen_record_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_specimen_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specimen_record" ADD CONSTRAINT "pages_blocks_specimen_record_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_specimen_record" ADD CONSTRAINT "pages_blocks_specimen_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_delivery_stories" ADD CONSTRAINT "pages_blocks_delivery_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "pages_blocks_aquarium_feature_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "pages_blocks_aquarium_feature_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_aquarium_feature_services" ADD CONSTRAINT "pages_blocks_aquarium_feature_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_aquarium_feature" ADD CONSTRAINT "pages_blocks_aquarium_feature_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_aquarium_feature" ADD CONSTRAINT "pages_blocks_aquarium_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_captions_track_id_media_id_fk" FOREIGN KEY ("captions_track_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_statements_statements" ADD CONSTRAINT "pages_blocks_trust_statements_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_statements_proof_points" ADD CONSTRAINT "pages_blocks_trust_statements_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_statements" ADD CONSTRAINT "pages_blocks_trust_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_articles" ADD CONSTRAINT "pages_blocks_featured_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faqs" ADD CONSTRAINT "pages_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_sourcing_categories_fk" FOREIGN KEY ("sourcing_categories_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_deliveries_fk" FOREIGN KEY ("deliveries_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_fish_image_id_media_id_fk" FOREIGN KEY ("fish_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section_intro" ADD CONSTRAINT "_pages_v_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_copy_split" ADD CONSTRAINT "_pages_v_blocks_media_copy_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_copy_split" ADD CONSTRAINT "_pages_v_blocks_media_copy_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_route_steps" ADD CONSTRAINT "_pages_v_blocks_process_route_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_route"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_route" ADD CONSTRAINT "_pages_v_blocks_process_route_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specimen_record_detail_images" ADD CONSTRAINT "_pages_v_blocks_specimen_record_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specimen_record_detail_images" ADD CONSTRAINT "_pages_v_blocks_specimen_record_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_specimen_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specimen_record" ADD CONSTRAINT "_pages_v_blocks_specimen_record_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specimen_record" ADD CONSTRAINT "_pages_v_blocks_specimen_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_delivery_stories" ADD CONSTRAINT "_pages_v_blocks_delivery_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "_pages_v_blocks_aquarium_feature_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "_pages_v_blocks_aquarium_feature_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_aquarium_feature_services" ADD CONSTRAINT "_pages_v_blocks_aquarium_feature_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_aquarium_feature" ADD CONSTRAINT "_pages_v_blocks_aquarium_feature_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_aquarium_feature" ADD CONSTRAINT "_pages_v_blocks_aquarium_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_captions_track_id_media_id_fk" FOREIGN KEY ("captions_track_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_statements_statements" ADD CONSTRAINT "_pages_v_blocks_trust_statements_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_statements_proof_points" ADD CONSTRAINT "_pages_v_blocks_trust_statements_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_statements" ADD CONSTRAINT "_pages_v_blocks_trust_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_articles" ADD CONSTRAINT "_pages_v_blocks_featured_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs" ADD CONSTRAINT "_pages_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_sourcing_categories_fk" FOREIGN KEY ("sourcing_categories_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_deliveries_fk" FOREIGN KEY ("deliveries_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_social" ADD CONSTRAINT "authors_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sourcing_categories" ADD CONSTRAINT "sourcing_categories_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sourcing_categories" ADD CONSTRAINT "sourcing_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deliveries_gallery" ADD CONSTRAINT "deliveries_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deliveries_gallery" ADD CONSTRAINT "deliveries_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deliveries_packing_media" ADD CONSTRAINT "deliveries_packing_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deliveries_packing_media" ADD CONSTRAINT "deliveries_packing_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_category_id_sourcing_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v_version_gallery" ADD CONSTRAINT "_deliveries_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v_version_gallery" ADD CONSTRAINT "_deliveries_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_deliveries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_deliveries_v_version_packing_media" ADD CONSTRAINT "_deliveries_v_version_packing_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v_version_packing_media" ADD CONSTRAINT "_deliveries_v_version_packing_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_deliveries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_deliveries_v" ADD CONSTRAINT "_deliveries_v_parent_id_deliveries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."deliveries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v" ADD CONSTRAINT "_deliveries_v_version_category_id_sourcing_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v" ADD CONSTRAINT "_deliveries_v_version_main_image_id_media_id_fk" FOREIGN KEY ("version_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_deliveries_v" ADD CONSTRAINT "_deliveries_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aquarium_projects_gallery" ADD CONSTRAINT "aquarium_projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aquarium_projects_gallery" ADD CONSTRAINT "aquarium_projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."aquarium_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aquarium_projects" ADD CONSTRAINT "aquarium_projects_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aquarium_projects" ADD CONSTRAINT "aquarium_projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aquarium_projects_v_version_gallery" ADD CONSTRAINT "_aquarium_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aquarium_projects_v_version_gallery" ADD CONSTRAINT "_aquarium_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_aquarium_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_aquarium_projects_v" ADD CONSTRAINT "_aquarium_projects_v_parent_id_aquarium_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."aquarium_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aquarium_projects_v" ADD CONSTRAINT "_aquarium_projects_v_version_cover_media_id_media_id_fk" FOREIGN KEY ("version_cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_aquarium_projects_v" ADD CONSTRAINT "_aquarium_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_related_delivery_id_deliveries_id_fk" FOREIGN KEY ("related_delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_reference_image_id_private_media_id_fk" FOREIGN KEY ("reference_image_id") REFERENCES "public"."private_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_texts" ADD CONSTRAINT "media_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sourcing_categories_fk" FOREIGN KEY ("sourcing_categories_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deliveries_fk" FOREIGN KEY ("deliveries_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_aquarium_projects_fk" FOREIGN KEY ("aquarium_projects_id") REFERENCES "public"."aquarium_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_media_fk" FOREIGN KEY ("private_media_id") REFERENCES "public"."private_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_section_intro" ADD CONSTRAINT "homepage_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_route_steps" ADD CONSTRAINT "homepage_blocks_process_route_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_process_route"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_route" ADD CONSTRAINT "homepage_blocks_process_route_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_category_grid" ADD CONSTRAINT "homepage_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_specimen_record_detail_images" ADD CONSTRAINT "homepage_blocks_specimen_record_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_specimen_record_detail_images" ADD CONSTRAINT "homepage_blocks_specimen_record_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_specimen_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_specimen_record" ADD CONSTRAINT "homepage_blocks_specimen_record_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_specimen_record" ADD CONSTRAINT "homepage_blocks_specimen_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_trust_statements_statements" ADD CONSTRAINT "homepage_blocks_trust_statements_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_trust_statements_proof_points" ADD CONSTRAINT "homepage_blocks_trust_statements_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_trust_statements" ADD CONSTRAINT "homepage_blocks_trust_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_delivery_stories" ADD CONSTRAINT "homepage_blocks_delivery_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "homepage_blocks_aquarium_feature_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "homepage_blocks_aquarium_feature_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_aquarium_feature_services" ADD CONSTRAINT "homepage_blocks_aquarium_feature_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_aquarium_feature" ADD CONSTRAINT "homepage_blocks_aquarium_feature_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_aquarium_feature" ADD CONSTRAINT "homepage_blocks_aquarium_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_featured_articles" ADD CONSTRAINT "homepage_blocks_featured_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faqs" ADD CONSTRAINT "homepage_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_media_copy_split" ADD CONSTRAINT "homepage_blocks_media_copy_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_media_copy_split" ADD CONSTRAINT "homepage_blocks_media_copy_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_rich_text" ADD CONSTRAINT "homepage_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_image_gallery_images" ADD CONSTRAINT "homepage_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_image_gallery_images" ADD CONSTRAINT "homepage_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_image_gallery" ADD CONSTRAINT "homepage_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_video" ADD CONSTRAINT "homepage_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_video" ADD CONSTRAINT "homepage_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_video" ADD CONSTRAINT "homepage_blocks_video_captions_track_id_media_id_fk" FOREIGN KEY ("captions_track_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_video" ADD CONSTRAINT "homepage_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_fish_image_id_media_id_fk" FOREIGN KEY ("hero_fish_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_sourcing_categories_fk" FOREIGN KEY ("sourcing_categories_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_deliveries_fk" FOREIGN KEY ("deliveries_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_section_intro" ADD CONSTRAINT "_homepage_v_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_route_steps" ADD CONSTRAINT "_homepage_v_blocks_process_route_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_process_route"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_route" ADD CONSTRAINT "_homepage_v_blocks_process_route_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_category_grid" ADD CONSTRAINT "_homepage_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_specimen_record_detail_images" ADD CONSTRAINT "_homepage_v_blocks_specimen_record_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_specimen_record_detail_images" ADD CONSTRAINT "_homepage_v_blocks_specimen_record_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_specimen_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_specimen_record" ADD CONSTRAINT "_homepage_v_blocks_specimen_record_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_specimen_record" ADD CONSTRAINT "_homepage_v_blocks_specimen_record_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_trust_statements_statements" ADD CONSTRAINT "_homepage_v_blocks_trust_statements_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_trust_statements_proof_points" ADD CONSTRAINT "_homepage_v_blocks_trust_statements_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_trust_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_trust_statements" ADD CONSTRAINT "_homepage_v_blocks_trust_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_delivery_stories" ADD CONSTRAINT "_homepage_v_blocks_delivery_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "_homepage_v_blocks_aquarium_feature_detail_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_aquarium_feature_detail_images" ADD CONSTRAINT "_homepage_v_blocks_aquarium_feature_detail_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_aquarium_feature_services" ADD CONSTRAINT "_homepage_v_blocks_aquarium_feature_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_aquarium_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_aquarium_feature" ADD CONSTRAINT "_homepage_v_blocks_aquarium_feature_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_aquarium_feature" ADD CONSTRAINT "_homepage_v_blocks_aquarium_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_featured_articles" ADD CONSTRAINT "_homepage_v_blocks_featured_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_faqs" ADD CONSTRAINT "_homepage_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_media_copy_split" ADD CONSTRAINT "_homepage_v_blocks_media_copy_split_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_media_copy_split" ADD CONSTRAINT "_homepage_v_blocks_media_copy_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_rich_text" ADD CONSTRAINT "_homepage_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_image_gallery_images" ADD CONSTRAINT "_homepage_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_image_gallery_images" ADD CONSTRAINT "_homepage_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_image_gallery" ADD CONSTRAINT "_homepage_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_video" ADD CONSTRAINT "_homepage_v_blocks_video_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_video" ADD CONSTRAINT "_homepage_v_blocks_video_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_video" ADD CONSTRAINT "_homepage_v_blocks_video_captions_track_id_media_id_fk" FOREIGN KEY ("captions_track_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_video" ADD CONSTRAINT "_homepage_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta" ADD CONSTRAINT "_homepage_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_fish_image_id_media_id_fk" FOREIGN KEY ("version_hero_fish_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_sourcing_categories_fk" FOREIGN KEY ("sourcing_categories_id") REFERENCES "public"."sourcing_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_deliveries_fk" FOREIGN KEY ("deliveries_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_image_id_media_id_fk" FOREIGN KEY ("default_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_groups_links" ADD CONSTRAINT "footer_nav_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_groups" ADD CONSTRAINT "footer_nav_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_policy_links" ADD CONSTRAINT "footer_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_fish_image_idx" ON "pages_blocks_hero" USING btree ("fish_image_id");
  CREATE INDEX "pages_blocks_section_intro_order_idx" ON "pages_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_intro_parent_id_idx" ON "pages_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_intro_path_idx" ON "pages_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_copy_split_order_idx" ON "pages_blocks_media_copy_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_copy_split_parent_id_idx" ON "pages_blocks_media_copy_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_copy_split_path_idx" ON "pages_blocks_media_copy_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_copy_split_media_idx" ON "pages_blocks_media_copy_split" USING btree ("media_id");
  CREATE INDEX "pages_blocks_process_route_steps_order_idx" ON "pages_blocks_process_route_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_route_steps_parent_id_idx" ON "pages_blocks_process_route_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_route_order_idx" ON "pages_blocks_process_route" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_route_parent_id_idx" ON "pages_blocks_process_route" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_route_path_idx" ON "pages_blocks_process_route" USING btree ("_path");
  CREATE INDEX "pages_blocks_category_grid_order_idx" ON "pages_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_grid_parent_id_idx" ON "pages_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_path_idx" ON "pages_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_specimen_record_detail_images_order_idx" ON "pages_blocks_specimen_record_detail_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_specimen_record_detail_images_parent_id_idx" ON "pages_blocks_specimen_record_detail_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specimen_record_detail_images_image_idx" ON "pages_blocks_specimen_record_detail_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_specimen_record_order_idx" ON "pages_blocks_specimen_record" USING btree ("_order");
  CREATE INDEX "pages_blocks_specimen_record_parent_id_idx" ON "pages_blocks_specimen_record" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specimen_record_path_idx" ON "pages_blocks_specimen_record" USING btree ("_path");
  CREATE INDEX "pages_blocks_specimen_record_main_image_idx" ON "pages_blocks_specimen_record" USING btree ("main_image_id");
  CREATE INDEX "pages_blocks_delivery_stories_order_idx" ON "pages_blocks_delivery_stories" USING btree ("_order");
  CREATE INDEX "pages_blocks_delivery_stories_parent_id_idx" ON "pages_blocks_delivery_stories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_delivery_stories_path_idx" ON "pages_blocks_delivery_stories" USING btree ("_path");
  CREATE INDEX "pages_blocks_aquarium_feature_detail_images_order_idx" ON "pages_blocks_aquarium_feature_detail_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_aquarium_feature_detail_images_parent_id_idx" ON "pages_blocks_aquarium_feature_detail_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_aquarium_feature_detail_images_image_idx" ON "pages_blocks_aquarium_feature_detail_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_aquarium_feature_services_order_idx" ON "pages_blocks_aquarium_feature_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_aquarium_feature_services_parent_id_idx" ON "pages_blocks_aquarium_feature_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_aquarium_feature_order_idx" ON "pages_blocks_aquarium_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_aquarium_feature_parent_id_idx" ON "pages_blocks_aquarium_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_aquarium_feature_path_idx" ON "pages_blocks_aquarium_feature" USING btree ("_path");
  CREATE INDEX "pages_blocks_aquarium_feature_main_image_idx" ON "pages_blocks_aquarium_feature" USING btree ("main_image_id");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_file_idx" ON "pages_blocks_video" USING btree ("file_id");
  CREATE INDEX "pages_blocks_video_poster_idx" ON "pages_blocks_video" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_video_captions_track_idx" ON "pages_blocks_video" USING btree ("captions_track_id");
  CREATE INDEX "pages_blocks_trust_statements_statements_order_idx" ON "pages_blocks_trust_statements_statements" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_statements_statements_parent_id_idx" ON "pages_blocks_trust_statements_statements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_statements_proof_points_order_idx" ON "pages_blocks_trust_statements_proof_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_statements_proof_points_parent_id_idx" ON "pages_blocks_trust_statements_proof_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_statements_order_idx" ON "pages_blocks_trust_statements" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_statements_parent_id_idx" ON "pages_blocks_trust_statements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_statements_path_idx" ON "pages_blocks_trust_statements" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_articles_order_idx" ON "pages_blocks_featured_articles" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_articles_parent_id_idx" ON "pages_blocks_featured_articles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_articles_path_idx" ON "pages_blocks_featured_articles" USING btree ("_path");
  CREATE INDEX "pages_blocks_faqs_order_idx" ON "pages_blocks_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_parent_id_idx" ON "pages_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_path_idx" ON "pages_blocks_faqs" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_sourcing_categories_id_idx" ON "pages_rels" USING btree ("sourcing_categories_id");
  CREATE INDEX "pages_rels_deliveries_id_idx" ON "pages_rels" USING btree ("deliveries_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_fish_image_idx" ON "_pages_v_blocks_hero" USING btree ("fish_image_id");
  CREATE INDEX "_pages_v_blocks_section_intro_order_idx" ON "_pages_v_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_intro_parent_id_idx" ON "_pages_v_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_intro_path_idx" ON "_pages_v_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_copy_split_order_idx" ON "_pages_v_blocks_media_copy_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_copy_split_parent_id_idx" ON "_pages_v_blocks_media_copy_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_copy_split_path_idx" ON "_pages_v_blocks_media_copy_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_copy_split_media_idx" ON "_pages_v_blocks_media_copy_split" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_process_route_steps_order_idx" ON "_pages_v_blocks_process_route_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_route_steps_parent_id_idx" ON "_pages_v_blocks_process_route_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_route_order_idx" ON "_pages_v_blocks_process_route" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_route_parent_id_idx" ON "_pages_v_blocks_process_route" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_route_path_idx" ON "_pages_v_blocks_process_route" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_category_grid_order_idx" ON "_pages_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_grid_parent_id_idx" ON "_pages_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_path_idx" ON "_pages_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_specimen_record_detail_images_order_idx" ON "_pages_v_blocks_specimen_record_detail_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_specimen_record_detail_images_parent_id_idx" ON "_pages_v_blocks_specimen_record_detail_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_specimen_record_detail_images_image_idx" ON "_pages_v_blocks_specimen_record_detail_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_specimen_record_order_idx" ON "_pages_v_blocks_specimen_record" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_specimen_record_parent_id_idx" ON "_pages_v_blocks_specimen_record" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_specimen_record_path_idx" ON "_pages_v_blocks_specimen_record" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_specimen_record_main_image_idx" ON "_pages_v_blocks_specimen_record" USING btree ("main_image_id");
  CREATE INDEX "_pages_v_blocks_delivery_stories_order_idx" ON "_pages_v_blocks_delivery_stories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_delivery_stories_parent_id_idx" ON "_pages_v_blocks_delivery_stories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_delivery_stories_path_idx" ON "_pages_v_blocks_delivery_stories" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_detail_images_order_idx" ON "_pages_v_blocks_aquarium_feature_detail_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_detail_images_parent_id_idx" ON "_pages_v_blocks_aquarium_feature_detail_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_detail_images_image_idx" ON "_pages_v_blocks_aquarium_feature_detail_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_services_order_idx" ON "_pages_v_blocks_aquarium_feature_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_services_parent_id_idx" ON "_pages_v_blocks_aquarium_feature_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_order_idx" ON "_pages_v_blocks_aquarium_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_parent_id_idx" ON "_pages_v_blocks_aquarium_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_path_idx" ON "_pages_v_blocks_aquarium_feature" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_aquarium_feature_main_image_idx" ON "_pages_v_blocks_aquarium_feature" USING btree ("main_image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_file_idx" ON "_pages_v_blocks_video" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_video_poster_idx" ON "_pages_v_blocks_video" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_video_captions_track_idx" ON "_pages_v_blocks_video" USING btree ("captions_track_id");
  CREATE INDEX "_pages_v_blocks_trust_statements_statements_order_idx" ON "_pages_v_blocks_trust_statements_statements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_statements_statements_parent_id_idx" ON "_pages_v_blocks_trust_statements_statements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_statements_proof_points_order_idx" ON "_pages_v_blocks_trust_statements_proof_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_statements_proof_points_parent_id_idx" ON "_pages_v_blocks_trust_statements_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_statements_order_idx" ON "_pages_v_blocks_trust_statements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_statements_parent_id_idx" ON "_pages_v_blocks_trust_statements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_statements_path_idx" ON "_pages_v_blocks_trust_statements" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_articles_order_idx" ON "_pages_v_blocks_featured_articles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_articles_parent_id_idx" ON "_pages_v_blocks_featured_articles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_articles_path_idx" ON "_pages_v_blocks_featured_articles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faqs_order_idx" ON "_pages_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_parent_id_idx" ON "_pages_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_path_idx" ON "_pages_v_blocks_faqs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_sourcing_categories_id_idx" ON "_pages_v_rels" USING btree ("sourcing_categories_id");
  CREATE INDEX "_pages_v_rels_deliveries_id_idx" ON "_pages_v_rels" USING btree ("deliveries_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "authors_social_order_idx" ON "authors_social" USING btree ("_order");
  CREATE INDEX "authors_social_parent_id_idx" ON "authors_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "sourcing_categories_slug_idx" ON "sourcing_categories" USING btree ("slug");
  CREATE INDEX "sourcing_categories_cover_media_idx" ON "sourcing_categories" USING btree ("cover_media_id");
  CREATE INDEX "sourcing_categories_meta_meta_image_idx" ON "sourcing_categories" USING btree ("meta_image_id");
  CREATE INDEX "sourcing_categories_updated_at_idx" ON "sourcing_categories" USING btree ("updated_at");
  CREATE INDEX "sourcing_categories_created_at_idx" ON "sourcing_categories" USING btree ("created_at");
  CREATE INDEX "deliveries_gallery_order_idx" ON "deliveries_gallery" USING btree ("_order");
  CREATE INDEX "deliveries_gallery_parent_id_idx" ON "deliveries_gallery" USING btree ("_parent_id");
  CREATE INDEX "deliveries_gallery_image_idx" ON "deliveries_gallery" USING btree ("image_id");
  CREATE INDEX "deliveries_packing_media_order_idx" ON "deliveries_packing_media" USING btree ("_order");
  CREATE INDEX "deliveries_packing_media_parent_id_idx" ON "deliveries_packing_media" USING btree ("_parent_id");
  CREATE INDEX "deliveries_packing_media_image_idx" ON "deliveries_packing_media" USING btree ("image_id");
  CREATE INDEX "deliveries_category_idx" ON "deliveries" USING btree ("category_id");
  CREATE INDEX "deliveries_main_image_idx" ON "deliveries" USING btree ("main_image_id");
  CREATE INDEX "deliveries_meta_meta_image_idx" ON "deliveries" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "deliveries_slug_idx" ON "deliveries" USING btree ("slug");
  CREATE INDEX "deliveries_updated_at_idx" ON "deliveries" USING btree ("updated_at");
  CREATE INDEX "deliveries_created_at_idx" ON "deliveries" USING btree ("created_at");
  CREATE INDEX "deliveries__status_idx" ON "deliveries" USING btree ("_status");
  CREATE INDEX "_deliveries_v_version_gallery_order_idx" ON "_deliveries_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_deliveries_v_version_gallery_parent_id_idx" ON "_deliveries_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_deliveries_v_version_gallery_image_idx" ON "_deliveries_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_deliveries_v_version_packing_media_order_idx" ON "_deliveries_v_version_packing_media" USING btree ("_order");
  CREATE INDEX "_deliveries_v_version_packing_media_parent_id_idx" ON "_deliveries_v_version_packing_media" USING btree ("_parent_id");
  CREATE INDEX "_deliveries_v_version_packing_media_image_idx" ON "_deliveries_v_version_packing_media" USING btree ("image_id");
  CREATE INDEX "_deliveries_v_parent_idx" ON "_deliveries_v" USING btree ("parent_id");
  CREATE INDEX "_deliveries_v_version_version_category_idx" ON "_deliveries_v" USING btree ("version_category_id");
  CREATE INDEX "_deliveries_v_version_version_main_image_idx" ON "_deliveries_v" USING btree ("version_main_image_id");
  CREATE INDEX "_deliveries_v_version_meta_version_meta_image_idx" ON "_deliveries_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_deliveries_v_version_version_slug_idx" ON "_deliveries_v" USING btree ("version_slug");
  CREATE INDEX "_deliveries_v_version_version_updated_at_idx" ON "_deliveries_v" USING btree ("version_updated_at");
  CREATE INDEX "_deliveries_v_version_version_created_at_idx" ON "_deliveries_v" USING btree ("version_created_at");
  CREATE INDEX "_deliveries_v_version_version__status_idx" ON "_deliveries_v" USING btree ("version__status");
  CREATE INDEX "_deliveries_v_created_at_idx" ON "_deliveries_v" USING btree ("created_at");
  CREATE INDEX "_deliveries_v_updated_at_idx" ON "_deliveries_v" USING btree ("updated_at");
  CREATE INDEX "_deliveries_v_latest_idx" ON "_deliveries_v" USING btree ("latest");
  CREATE INDEX "_deliveries_v_autosave_idx" ON "_deliveries_v" USING btree ("autosave");
  CREATE INDEX "aquarium_projects_gallery_order_idx" ON "aquarium_projects_gallery" USING btree ("_order");
  CREATE INDEX "aquarium_projects_gallery_parent_id_idx" ON "aquarium_projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "aquarium_projects_gallery_image_idx" ON "aquarium_projects_gallery" USING btree ("image_id");
  CREATE INDEX "aquarium_projects_cover_media_idx" ON "aquarium_projects" USING btree ("cover_media_id");
  CREATE INDEX "aquarium_projects_meta_meta_image_idx" ON "aquarium_projects" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "aquarium_projects_slug_idx" ON "aquarium_projects" USING btree ("slug");
  CREATE INDEX "aquarium_projects_updated_at_idx" ON "aquarium_projects" USING btree ("updated_at");
  CREATE INDEX "aquarium_projects_created_at_idx" ON "aquarium_projects" USING btree ("created_at");
  CREATE INDEX "aquarium_projects__status_idx" ON "aquarium_projects" USING btree ("_status");
  CREATE INDEX "_aquarium_projects_v_version_gallery_order_idx" ON "_aquarium_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_aquarium_projects_v_version_gallery_parent_id_idx" ON "_aquarium_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_aquarium_projects_v_version_gallery_image_idx" ON "_aquarium_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_aquarium_projects_v_parent_idx" ON "_aquarium_projects_v" USING btree ("parent_id");
  CREATE INDEX "_aquarium_projects_v_version_version_cover_media_idx" ON "_aquarium_projects_v" USING btree ("version_cover_media_id");
  CREATE INDEX "_aquarium_projects_v_version_meta_version_meta_image_idx" ON "_aquarium_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_aquarium_projects_v_version_version_slug_idx" ON "_aquarium_projects_v" USING btree ("version_slug");
  CREATE INDEX "_aquarium_projects_v_version_version_updated_at_idx" ON "_aquarium_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_aquarium_projects_v_version_version_created_at_idx" ON "_aquarium_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_aquarium_projects_v_version_version__status_idx" ON "_aquarium_projects_v" USING btree ("version__status");
  CREATE INDEX "_aquarium_projects_v_created_at_idx" ON "_aquarium_projects_v" USING btree ("created_at");
  CREATE INDEX "_aquarium_projects_v_updated_at_idx" ON "_aquarium_projects_v" USING btree ("updated_at");
  CREATE INDEX "_aquarium_projects_v_latest_idx" ON "_aquarium_projects_v" USING btree ("latest");
  CREATE INDEX "_aquarium_projects_v_autosave_idx" ON "_aquarium_projects_v" USING btree ("autosave");
  CREATE INDEX "testimonials_related_delivery_idx" ON "testimonials" USING btree ("related_delivery_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "enquiries_request_id_idx" ON "enquiries" USING btree ("request_id");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE INDEX "enquiries_reference_image_idx" ON "enquiries" USING btree ("reference_image_id");
  CREATE INDEX "enquiries_meta_meta_submission_token_idx" ON "enquiries" USING btree ("meta_submission_token");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_seed_key_idx" ON "media" USING btree ("seed_key");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "media_sizes_desktop_sizes_desktop_filename_idx" ON "media" USING btree ("sizes_desktop_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_social_sizes_social_filename_idx" ON "media" USING btree ("sizes_social_filename");
  CREATE INDEX "media_texts_order_parent" ON "media_texts" USING btree ("order","parent_id");
  CREATE INDEX "private_media_enquiry_request_id_idx" ON "private_media" USING btree ("enquiry_request_id");
  CREATE INDEX "private_media_updated_at_idx" ON "private_media" USING btree ("updated_at");
  CREATE INDEX "private_media_created_at_idx" ON "private_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "private_media_filename_idx" ON "private_media" USING btree ("filename");
  CREATE INDEX "private_media_sizes_preview_sizes_preview_filename_idx" ON "private_media" USING btree ("sizes_preview_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_sourcing_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("sourcing_categories_id");
  CREATE INDEX "payload_locked_documents_rels_deliveries_id_idx" ON "payload_locked_documents_rels" USING btree ("deliveries_id");
  CREATE INDEX "payload_locked_documents_rels_aquarium_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("aquarium_projects_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_private_media_id_idx" ON "payload_locked_documents_rels" USING btree ("private_media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_blocks_section_intro_order_idx" ON "homepage_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "homepage_blocks_section_intro_parent_id_idx" ON "homepage_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_section_intro_path_idx" ON "homepage_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "homepage_blocks_process_route_steps_order_idx" ON "homepage_blocks_process_route_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_route_steps_parent_id_idx" ON "homepage_blocks_process_route_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_process_route_order_idx" ON "homepage_blocks_process_route" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_route_parent_id_idx" ON "homepage_blocks_process_route" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_process_route_path_idx" ON "homepage_blocks_process_route" USING btree ("_path");
  CREATE INDEX "homepage_blocks_category_grid_order_idx" ON "homepage_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_category_grid_parent_id_idx" ON "homepage_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_category_grid_path_idx" ON "homepage_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "homepage_blocks_specimen_record_detail_images_order_idx" ON "homepage_blocks_specimen_record_detail_images" USING btree ("_order");
  CREATE INDEX "homepage_blocks_specimen_record_detail_images_parent_id_idx" ON "homepage_blocks_specimen_record_detail_images" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_specimen_record_detail_images_image_idx" ON "homepage_blocks_specimen_record_detail_images" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_specimen_record_order_idx" ON "homepage_blocks_specimen_record" USING btree ("_order");
  CREATE INDEX "homepage_blocks_specimen_record_parent_id_idx" ON "homepage_blocks_specimen_record" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_specimen_record_path_idx" ON "homepage_blocks_specimen_record" USING btree ("_path");
  CREATE INDEX "homepage_blocks_specimen_record_main_image_idx" ON "homepage_blocks_specimen_record" USING btree ("main_image_id");
  CREATE INDEX "homepage_blocks_trust_statements_statements_order_idx" ON "homepage_blocks_trust_statements_statements" USING btree ("_order");
  CREATE INDEX "homepage_blocks_trust_statements_statements_parent_id_idx" ON "homepage_blocks_trust_statements_statements" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_trust_statements_proof_points_order_idx" ON "homepage_blocks_trust_statements_proof_points" USING btree ("_order");
  CREATE INDEX "homepage_blocks_trust_statements_proof_points_parent_id_idx" ON "homepage_blocks_trust_statements_proof_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_trust_statements_order_idx" ON "homepage_blocks_trust_statements" USING btree ("_order");
  CREATE INDEX "homepage_blocks_trust_statements_parent_id_idx" ON "homepage_blocks_trust_statements" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_trust_statements_path_idx" ON "homepage_blocks_trust_statements" USING btree ("_path");
  CREATE INDEX "homepage_blocks_delivery_stories_order_idx" ON "homepage_blocks_delivery_stories" USING btree ("_order");
  CREATE INDEX "homepage_blocks_delivery_stories_parent_id_idx" ON "homepage_blocks_delivery_stories" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_delivery_stories_path_idx" ON "homepage_blocks_delivery_stories" USING btree ("_path");
  CREATE INDEX "homepage_blocks_aquarium_feature_detail_images_order_idx" ON "homepage_blocks_aquarium_feature_detail_images" USING btree ("_order");
  CREATE INDEX "homepage_blocks_aquarium_feature_detail_images_parent_id_idx" ON "homepage_blocks_aquarium_feature_detail_images" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_aquarium_feature_detail_images_image_idx" ON "homepage_blocks_aquarium_feature_detail_images" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_aquarium_feature_services_order_idx" ON "homepage_blocks_aquarium_feature_services" USING btree ("_order");
  CREATE INDEX "homepage_blocks_aquarium_feature_services_parent_id_idx" ON "homepage_blocks_aquarium_feature_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_aquarium_feature_order_idx" ON "homepage_blocks_aquarium_feature" USING btree ("_order");
  CREATE INDEX "homepage_blocks_aquarium_feature_parent_id_idx" ON "homepage_blocks_aquarium_feature" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_aquarium_feature_path_idx" ON "homepage_blocks_aquarium_feature" USING btree ("_path");
  CREATE INDEX "homepage_blocks_aquarium_feature_main_image_idx" ON "homepage_blocks_aquarium_feature" USING btree ("main_image_id");
  CREATE INDEX "homepage_blocks_featured_articles_order_idx" ON "homepage_blocks_featured_articles" USING btree ("_order");
  CREATE INDEX "homepage_blocks_featured_articles_parent_id_idx" ON "homepage_blocks_featured_articles" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_featured_articles_path_idx" ON "homepage_blocks_featured_articles" USING btree ("_path");
  CREATE INDEX "homepage_blocks_faqs_order_idx" ON "homepage_blocks_faqs" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faqs_parent_id_idx" ON "homepage_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faqs_path_idx" ON "homepage_blocks_faqs" USING btree ("_path");
  CREATE INDEX "homepage_blocks_media_copy_split_order_idx" ON "homepage_blocks_media_copy_split" USING btree ("_order");
  CREATE INDEX "homepage_blocks_media_copy_split_parent_id_idx" ON "homepage_blocks_media_copy_split" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_media_copy_split_path_idx" ON "homepage_blocks_media_copy_split" USING btree ("_path");
  CREATE INDEX "homepage_blocks_media_copy_split_media_idx" ON "homepage_blocks_media_copy_split" USING btree ("media_id");
  CREATE INDEX "homepage_blocks_rich_text_order_idx" ON "homepage_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "homepage_blocks_rich_text_parent_id_idx" ON "homepage_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_path_idx" ON "homepage_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "homepage_blocks_image_gallery_images_order_idx" ON "homepage_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "homepage_blocks_image_gallery_images_parent_id_idx" ON "homepage_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_image_gallery_images_image_idx" ON "homepage_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_image_gallery_order_idx" ON "homepage_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "homepage_blocks_image_gallery_parent_id_idx" ON "homepage_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_image_gallery_path_idx" ON "homepage_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "homepage_blocks_video_order_idx" ON "homepage_blocks_video" USING btree ("_order");
  CREATE INDEX "homepage_blocks_video_parent_id_idx" ON "homepage_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_video_path_idx" ON "homepage_blocks_video" USING btree ("_path");
  CREATE INDEX "homepage_blocks_video_file_idx" ON "homepage_blocks_video" USING btree ("file_id");
  CREATE INDEX "homepage_blocks_video_poster_idx" ON "homepage_blocks_video" USING btree ("poster_id");
  CREATE INDEX "homepage_blocks_video_captions_track_idx" ON "homepage_blocks_video" USING btree ("captions_track_id");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE INDEX "homepage_hero_hero_fish_image_idx" ON "homepage" USING btree ("hero_fish_image_id");
  CREATE INDEX "homepage_meta_meta_image_idx" ON "homepage" USING btree ("meta_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_sourcing_categories_id_idx" ON "homepage_rels" USING btree ("sourcing_categories_id");
  CREATE INDEX "homepage_rels_deliveries_id_idx" ON "homepage_rels" USING btree ("deliveries_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX "homepage_rels_faqs_id_idx" ON "homepage_rels" USING btree ("faqs_id");
  CREATE INDEX "_homepage_v_blocks_section_intro_order_idx" ON "_homepage_v_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_section_intro_parent_id_idx" ON "_homepage_v_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_section_intro_path_idx" ON "_homepage_v_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_process_route_steps_order_idx" ON "_homepage_v_blocks_process_route_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_route_steps_parent_id_idx" ON "_homepage_v_blocks_process_route_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_route_order_idx" ON "_homepage_v_blocks_process_route" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_route_parent_id_idx" ON "_homepage_v_blocks_process_route" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_route_path_idx" ON "_homepage_v_blocks_process_route" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_category_grid_order_idx" ON "_homepage_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_category_grid_parent_id_idx" ON "_homepage_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_category_grid_path_idx" ON "_homepage_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_specimen_record_detail_images_order_idx" ON "_homepage_v_blocks_specimen_record_detail_images" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_specimen_record_detail_images_parent_id_idx" ON "_homepage_v_blocks_specimen_record_detail_images" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_specimen_record_detail_images_image_idx" ON "_homepage_v_blocks_specimen_record_detail_images" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_specimen_record_order_idx" ON "_homepage_v_blocks_specimen_record" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_specimen_record_parent_id_idx" ON "_homepage_v_blocks_specimen_record" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_specimen_record_path_idx" ON "_homepage_v_blocks_specimen_record" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_specimen_record_main_image_idx" ON "_homepage_v_blocks_specimen_record" USING btree ("main_image_id");
  CREATE INDEX "_homepage_v_blocks_trust_statements_statements_order_idx" ON "_homepage_v_blocks_trust_statements_statements" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_trust_statements_statements_parent_id_idx" ON "_homepage_v_blocks_trust_statements_statements" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_trust_statements_proof_points_order_idx" ON "_homepage_v_blocks_trust_statements_proof_points" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_trust_statements_proof_points_parent_id_idx" ON "_homepage_v_blocks_trust_statements_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_trust_statements_order_idx" ON "_homepage_v_blocks_trust_statements" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_trust_statements_parent_id_idx" ON "_homepage_v_blocks_trust_statements" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_trust_statements_path_idx" ON "_homepage_v_blocks_trust_statements" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_delivery_stories_order_idx" ON "_homepage_v_blocks_delivery_stories" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_delivery_stories_parent_id_idx" ON "_homepage_v_blocks_delivery_stories" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_delivery_stories_path_idx" ON "_homepage_v_blocks_delivery_stories" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_detail_images_order_idx" ON "_homepage_v_blocks_aquarium_feature_detail_images" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_detail_images_parent_id_idx" ON "_homepage_v_blocks_aquarium_feature_detail_images" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_detail_images_image_idx" ON "_homepage_v_blocks_aquarium_feature_detail_images" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_services_order_idx" ON "_homepage_v_blocks_aquarium_feature_services" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_services_parent_id_idx" ON "_homepage_v_blocks_aquarium_feature_services" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_order_idx" ON "_homepage_v_blocks_aquarium_feature" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_parent_id_idx" ON "_homepage_v_blocks_aquarium_feature" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_path_idx" ON "_homepage_v_blocks_aquarium_feature" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_aquarium_feature_main_image_idx" ON "_homepage_v_blocks_aquarium_feature" USING btree ("main_image_id");
  CREATE INDEX "_homepage_v_blocks_featured_articles_order_idx" ON "_homepage_v_blocks_featured_articles" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_featured_articles_parent_id_idx" ON "_homepage_v_blocks_featured_articles" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_featured_articles_path_idx" ON "_homepage_v_blocks_featured_articles" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_faqs_order_idx" ON "_homepage_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faqs_parent_id_idx" ON "_homepage_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faqs_path_idx" ON "_homepage_v_blocks_faqs" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_media_copy_split_order_idx" ON "_homepage_v_blocks_media_copy_split" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_media_copy_split_parent_id_idx" ON "_homepage_v_blocks_media_copy_split" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_media_copy_split_path_idx" ON "_homepage_v_blocks_media_copy_split" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_media_copy_split_media_idx" ON "_homepage_v_blocks_media_copy_split" USING btree ("media_id");
  CREATE INDEX "_homepage_v_blocks_rich_text_order_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_rich_text_parent_id_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_rich_text_path_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_image_gallery_images_order_idx" ON "_homepage_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_image_gallery_images_parent_id_idx" ON "_homepage_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_image_gallery_images_image_idx" ON "_homepage_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_image_gallery_order_idx" ON "_homepage_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_image_gallery_parent_id_idx" ON "_homepage_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_image_gallery_path_idx" ON "_homepage_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_video_order_idx" ON "_homepage_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_video_parent_id_idx" ON "_homepage_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_video_path_idx" ON "_homepage_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_video_file_idx" ON "_homepage_v_blocks_video" USING btree ("file_id");
  CREATE INDEX "_homepage_v_blocks_video_poster_idx" ON "_homepage_v_blocks_video" USING btree ("poster_id");
  CREATE INDEX "_homepage_v_blocks_video_captions_track_idx" ON "_homepage_v_blocks_video" USING btree ("captions_track_id");
  CREATE INDEX "_homepage_v_blocks_cta_order_idx" ON "_homepage_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_cta_parent_id_idx" ON "_homepage_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_cta_path_idx" ON "_homepage_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_homepage_v_version_hero_version_hero_fish_image_idx" ON "_homepage_v" USING btree ("version_hero_fish_image_id");
  CREATE INDEX "_homepage_v_version_meta_version_meta_image_idx" ON "_homepage_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_sourcing_categories_id_idx" ON "_homepage_v_rels" USING btree ("sourcing_categories_id");
  CREATE INDEX "_homepage_v_rels_deliveries_id_idx" ON "_homepage_v_rels" USING btree ("deliveries_id");
  CREATE INDEX "_homepage_v_rels_posts_id_idx" ON "_homepage_v_rels" USING btree ("posts_id");
  CREATE INDEX "_homepage_v_rels_faqs_id_idx" ON "_homepage_v_rels" USING btree ("faqs_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_on_dark_idx" ON "site_settings" USING btree ("logo_on_dark_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_seo_default_seo_image_idx" ON "site_settings" USING btree ("default_seo_image_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_groups_links_order_idx" ON "footer_nav_groups_links" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_links_parent_id_idx" ON "footer_nav_groups_links" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_groups_order_idx" ON "footer_nav_groups" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_parent_id_idx" ON "footer_nav_groups" USING btree ("_parent_id");
  CREATE INDEX "footer_policy_links_order_idx" ON "footer_policy_links" USING btree ("_order");
  CREATE INDEX "footer_policy_links_parent_id_idx" ON "footer_policy_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_section_intro" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_media_copy_split" CASCADE;
  DROP TABLE "pages_blocks_process_route_steps" CASCADE;
  DROP TABLE "pages_blocks_process_route" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_specimen_record_detail_images" CASCADE;
  DROP TABLE "pages_blocks_specimen_record" CASCADE;
  DROP TABLE "pages_blocks_delivery_stories" CASCADE;
  DROP TABLE "pages_blocks_aquarium_feature_detail_images" CASCADE;
  DROP TABLE "pages_blocks_aquarium_feature_services" CASCADE;
  DROP TABLE "pages_blocks_aquarium_feature" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_trust_statements_statements" CASCADE;
  DROP TABLE "pages_blocks_trust_statements_proof_points" CASCADE;
  DROP TABLE "pages_blocks_trust_statements" CASCADE;
  DROP TABLE "pages_blocks_featured_articles" CASCADE;
  DROP TABLE "pages_blocks_faqs" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_section_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_media_copy_split" CASCADE;
  DROP TABLE "_pages_v_blocks_process_route_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_route" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_specimen_record_detail_images" CASCADE;
  DROP TABLE "_pages_v_blocks_specimen_record" CASCADE;
  DROP TABLE "_pages_v_blocks_delivery_stories" CASCADE;
  DROP TABLE "_pages_v_blocks_aquarium_feature_detail_images" CASCADE;
  DROP TABLE "_pages_v_blocks_aquarium_feature_services" CASCADE;
  DROP TABLE "_pages_v_blocks_aquarium_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_statements_statements" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_statements_proof_points" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_statements" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_articles" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "authors_social" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "sourcing_categories" CASCADE;
  DROP TABLE "deliveries_gallery" CASCADE;
  DROP TABLE "deliveries_packing_media" CASCADE;
  DROP TABLE "deliveries" CASCADE;
  DROP TABLE "_deliveries_v_version_gallery" CASCADE;
  DROP TABLE "_deliveries_v_version_packing_media" CASCADE;
  DROP TABLE "_deliveries_v" CASCADE;
  DROP TABLE "aquarium_projects_gallery" CASCADE;
  DROP TABLE "aquarium_projects" CASCADE;
  DROP TABLE "_aquarium_projects_v_version_gallery" CASCADE;
  DROP TABLE "_aquarium_projects_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_texts" CASCADE;
  DROP TABLE "private_media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_blocks_section_intro" CASCADE;
  DROP TABLE "homepage_blocks_process_route_steps" CASCADE;
  DROP TABLE "homepage_blocks_process_route" CASCADE;
  DROP TABLE "homepage_blocks_category_grid" CASCADE;
  DROP TABLE "homepage_blocks_specimen_record_detail_images" CASCADE;
  DROP TABLE "homepage_blocks_specimen_record" CASCADE;
  DROP TABLE "homepage_blocks_trust_statements_statements" CASCADE;
  DROP TABLE "homepage_blocks_trust_statements_proof_points" CASCADE;
  DROP TABLE "homepage_blocks_trust_statements" CASCADE;
  DROP TABLE "homepage_blocks_delivery_stories" CASCADE;
  DROP TABLE "homepage_blocks_aquarium_feature_detail_images" CASCADE;
  DROP TABLE "homepage_blocks_aquarium_feature_services" CASCADE;
  DROP TABLE "homepage_blocks_aquarium_feature" CASCADE;
  DROP TABLE "homepage_blocks_featured_articles" CASCADE;
  DROP TABLE "homepage_blocks_faqs" CASCADE;
  DROP TABLE "homepage_blocks_media_copy_split" CASCADE;
  DROP TABLE "homepage_blocks_rich_text" CASCADE;
  DROP TABLE "homepage_blocks_image_gallery_images" CASCADE;
  DROP TABLE "homepage_blocks_image_gallery" CASCADE;
  DROP TABLE "homepage_blocks_video" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_blocks_section_intro" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_route_steps" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_route" CASCADE;
  DROP TABLE "_homepage_v_blocks_category_grid" CASCADE;
  DROP TABLE "_homepage_v_blocks_specimen_record_detail_images" CASCADE;
  DROP TABLE "_homepage_v_blocks_specimen_record" CASCADE;
  DROP TABLE "_homepage_v_blocks_trust_statements_statements" CASCADE;
  DROP TABLE "_homepage_v_blocks_trust_statements_proof_points" CASCADE;
  DROP TABLE "_homepage_v_blocks_trust_statements" CASCADE;
  DROP TABLE "_homepage_v_blocks_delivery_stories" CASCADE;
  DROP TABLE "_homepage_v_blocks_aquarium_feature_detail_images" CASCADE;
  DROP TABLE "_homepage_v_blocks_aquarium_feature_services" CASCADE;
  DROP TABLE "_homepage_v_blocks_aquarium_feature" CASCADE;
  DROP TABLE "_homepage_v_blocks_featured_articles" CASCADE;
  DROP TABLE "_homepage_v_blocks_faqs" CASCADE;
  DROP TABLE "_homepage_v_blocks_media_copy_split" CASCADE;
  DROP TABLE "_homepage_v_blocks_rich_text" CASCADE;
  DROP TABLE "_homepage_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_homepage_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_homepage_v_blocks_video" CASCADE;
  DROP TABLE "_homepage_v_blocks_cta" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_nav_groups_links" CASCADE;
  DROP TABLE "footer_nav_groups" CASCADE;
  DROP TABLE "footer_policy_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_primary_cta_type";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_cta_type";
  DROP TYPE "public"."enum_pages_blocks_section_intro_background";
  DROP TYPE "public"."enum_pages_blocks_section_intro_alignment";
  DROP TYPE "public"."enum_pages_blocks_rich_text_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_media_copy_split_background";
  DROP TYPE "public"."enum_pages_blocks_media_copy_split_media_position";
  DROP TYPE "public"."enum_pages_blocks_media_copy_split_media_shape";
  DROP TYPE "public"."enum_pages_blocks_media_copy_split_cta_type";
  DROP TYPE "public"."enum_pages_blocks_process_route_background";
  DROP TYPE "public"."enum_pages_blocks_process_route_cta_type";
  DROP TYPE "public"."enum_pages_blocks_category_grid_background";
  DROP TYPE "public"."enum_pages_blocks_category_grid_mode";
  DROP TYPE "public"."enum_pages_blocks_category_grid_cta_type";
  DROP TYPE "public"."enum_pages_blocks_specimen_record_background";
  DROP TYPE "public"."enum_pages_blocks_specimen_record_record_media_status";
  DROP TYPE "public"."enum_pages_blocks_delivery_stories_background";
  DROP TYPE "public"."enum_pages_blocks_delivery_stories_mode";
  DROP TYPE "public"."enum_pages_blocks_delivery_stories_empty_state_behaviour";
  DROP TYPE "public"."enum_pages_blocks_delivery_stories_cta_type";
  DROP TYPE "public"."enum_pages_blocks_aquarium_feature_cta_type";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_background";
  DROP TYPE "public"."enum_pages_blocks_video_background";
  DROP TYPE "public"."enum_pages_blocks_video_source";
  DROP TYPE "public"."enum_pages_blocks_trust_statements_background";
  DROP TYPE "public"."enum_pages_blocks_featured_articles_background";
  DROP TYPE "public"."enum_pages_blocks_featured_articles_mode";
  DROP TYPE "public"."enum_pages_blocks_featured_articles_empty_state_behaviour";
  DROP TYPE "public"."enum_pages_blocks_featured_articles_cta_type";
  DROP TYPE "public"."enum_pages_blocks_faqs_background";
  DROP TYPE "public"."enum_pages_blocks_faqs_mode";
  DROP TYPE "public"."enum_pages_blocks_faqs_category";
  DROP TYPE "public"."enum_pages_blocks_cta_background";
  DROP TYPE "public"."enum_pages_blocks_cta_primary_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_secondary_cta_type";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_section_intro_background";
  DROP TYPE "public"."enum__pages_v_blocks_section_intro_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_media_copy_split_background";
  DROP TYPE "public"."enum__pages_v_blocks_media_copy_split_media_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_copy_split_media_shape";
  DROP TYPE "public"."enum__pages_v_blocks_media_copy_split_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_process_route_background";
  DROP TYPE "public"."enum__pages_v_blocks_process_route_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_mode";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_specimen_record_background";
  DROP TYPE "public"."enum__pages_v_blocks_specimen_record_record_media_status";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_stories_background";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_stories_mode";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_stories_empty_state_behaviour";
  DROP TYPE "public"."enum__pages_v_blocks_delivery_stories_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_aquarium_feature_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_background";
  DROP TYPE "public"."enum__pages_v_blocks_video_background";
  DROP TYPE "public"."enum__pages_v_blocks_video_source";
  DROP TYPE "public"."enum__pages_v_blocks_trust_statements_background";
  DROP TYPE "public"."enum__pages_v_blocks_featured_articles_background";
  DROP TYPE "public"."enum__pages_v_blocks_featured_articles_mode";
  DROP TYPE "public"."enum__pages_v_blocks_featured_articles_empty_state_behaviour";
  DROP TYPE "public"."enum__pages_v_blocks_featured_articles_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_background";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_mode";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_category";
  DROP TYPE "public"."enum__pages_v_blocks_cta_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_primary_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_secondary_cta_type";
  DROP TYPE "public"."enum__pages_v_version_page_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_deliveries_status";
  DROP TYPE "public"."enum__deliveries_v_version_status";
  DROP TYPE "public"."enum_aquarium_projects_service_type";
  DROP TYPE "public"."enum_aquarium_projects_status";
  DROP TYPE "public"."enum__aquarium_projects_v_version_service_type";
  DROP TYPE "public"."enum__aquarium_projects_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_enquiries_alternatives_accepted";
  DROP TYPE "public"."enum_enquiries_tank_cycled";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_homepage_blocks_section_intro_background";
  DROP TYPE "public"."enum_homepage_blocks_section_intro_alignment";
  DROP TYPE "public"."enum_homepage_blocks_process_route_background";
  DROP TYPE "public"."enum_homepage_blocks_process_route_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_category_grid_background";
  DROP TYPE "public"."enum_homepage_blocks_category_grid_mode";
  DROP TYPE "public"."enum_homepage_blocks_category_grid_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_specimen_record_background";
  DROP TYPE "public"."enum_homepage_blocks_specimen_record_record_media_status";
  DROP TYPE "public"."enum_homepage_blocks_trust_statements_background";
  DROP TYPE "public"."enum_homepage_blocks_delivery_stories_background";
  DROP TYPE "public"."enum_homepage_blocks_delivery_stories_mode";
  DROP TYPE "public"."enum_homepage_blocks_delivery_stories_empty_state_behaviour";
  DROP TYPE "public"."enum_homepage_blocks_delivery_stories_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_aquarium_feature_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_featured_articles_background";
  DROP TYPE "public"."enum_homepage_blocks_featured_articles_mode";
  DROP TYPE "public"."enum_homepage_blocks_featured_articles_empty_state_behaviour";
  DROP TYPE "public"."enum_homepage_blocks_featured_articles_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_faqs_background";
  DROP TYPE "public"."enum_homepage_blocks_faqs_mode";
  DROP TYPE "public"."enum_homepage_blocks_faqs_category";
  DROP TYPE "public"."enum_homepage_blocks_media_copy_split_background";
  DROP TYPE "public"."enum_homepage_blocks_media_copy_split_media_position";
  DROP TYPE "public"."enum_homepage_blocks_media_copy_split_media_shape";
  DROP TYPE "public"."enum_homepage_blocks_media_copy_split_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_rich_text_background";
  DROP TYPE "public"."enum_homepage_blocks_rich_text_width";
  DROP TYPE "public"."enum_homepage_blocks_image_gallery_background";
  DROP TYPE "public"."enum_homepage_blocks_video_background";
  DROP TYPE "public"."enum_homepage_blocks_video_source";
  DROP TYPE "public"."enum_homepage_blocks_cta_background";
  DROP TYPE "public"."enum_homepage_blocks_cta_primary_cta_type";
  DROP TYPE "public"."enum_homepage_blocks_cta_secondary_cta_type";
  DROP TYPE "public"."enum_homepage_hero_primary_cta_type";
  DROP TYPE "public"."enum_homepage_hero_secondary_cta_type";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_blocks_section_intro_background";
  DROP TYPE "public"."enum__homepage_v_blocks_section_intro_alignment";
  DROP TYPE "public"."enum__homepage_v_blocks_process_route_background";
  DROP TYPE "public"."enum__homepage_v_blocks_process_route_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_category_grid_background";
  DROP TYPE "public"."enum__homepage_v_blocks_category_grid_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_category_grid_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_specimen_record_background";
  DROP TYPE "public"."enum__homepage_v_blocks_specimen_record_record_media_status";
  DROP TYPE "public"."enum__homepage_v_blocks_trust_statements_background";
  DROP TYPE "public"."enum__homepage_v_blocks_delivery_stories_background";
  DROP TYPE "public"."enum__homepage_v_blocks_delivery_stories_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_delivery_stories_empty_state_behaviour";
  DROP TYPE "public"."enum__homepage_v_blocks_delivery_stories_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_aquarium_feature_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_featured_articles_background";
  DROP TYPE "public"."enum__homepage_v_blocks_featured_articles_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_featured_articles_empty_state_behaviour";
  DROP TYPE "public"."enum__homepage_v_blocks_featured_articles_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_faqs_background";
  DROP TYPE "public"."enum__homepage_v_blocks_faqs_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_faqs_category";
  DROP TYPE "public"."enum__homepage_v_blocks_media_copy_split_background";
  DROP TYPE "public"."enum__homepage_v_blocks_media_copy_split_media_position";
  DROP TYPE "public"."enum__homepage_v_blocks_media_copy_split_media_shape";
  DROP TYPE "public"."enum__homepage_v_blocks_media_copy_split_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_rich_text_background";
  DROP TYPE "public"."enum__homepage_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__homepage_v_blocks_image_gallery_background";
  DROP TYPE "public"."enum__homepage_v_blocks_video_background";
  DROP TYPE "public"."enum__homepage_v_blocks_video_source";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_background";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_primary_cta_type";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_secondary_cta_type";
  DROP TYPE "public"."enum__homepage_v_version_hero_primary_cta_type";
  DROP TYPE "public"."enum__homepage_v_version_hero_secondary_cta_type";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_site_settings_analytics_provider";
  DROP TYPE "public"."enum_header_cta_type";`)
}
