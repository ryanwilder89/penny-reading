CREATE TABLE `decodable_passages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`word_count` integer NOT NULL,
	`max_pattern_id` text,
	`patterns_used` text
);
--> statement-breakpoint
CREATE TABLE `fluency_scores` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`passage_id` text NOT NULL,
	`reading_number` integer NOT NULL,
	`total_words` integer NOT NULL,
	`errors` integer NOT NULL,
	`wcpm` real NOT NULL,
	`accuracy_pct` real NOT NULL,
	`time_seconds` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `phonics_patterns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phase` integer NOT NULL,
	`sequence_order` real NOT NULL,
	`description` text,
	`parent_script` text
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`pattern_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`accuracy_history` text,
	`date_introduced` text,
	`date_mastered` text,
	`mastery_criteria_met` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `review_words` (
	`id` text PRIMARY KEY NOT NULL,
	`word` text NOT NULL,
	`date_added` text NOT NULL,
	`next_review_date` text NOT NULL,
	`times_missed` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`lesson_id` text,
	`started_at` integer,
	`completed_at` integer,
	`parent_id` text,
	`parent_notes` text
);
--> statement-breakpoint
CREATE TABLE `word_chains` (
	`id` text PRIMARY KEY NOT NULL,
	`pattern_id` text NOT NULL,
	`words` text NOT NULL,
	`change_positions` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`is_nonsense` integer DEFAULT false,
	`frequency_list` text
);
