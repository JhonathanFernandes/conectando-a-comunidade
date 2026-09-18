CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"source" varchar(100) NOT NULL,
	"sourceUrl" text NOT NULL,
	"publishedAt" timestamp with time zone NOT NULL,
	"cycleDate" date NOT NULL,
	"category" varchar(100),
	"imageUrl" text,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "news_source_url_unique" ON "news" USING btree ("sourceUrl");--> statement-breakpoint
CREATE INDEX "news_cycle_date_idx" ON "news" USING btree ("cycleDate");--> statement-breakpoint
CREATE INDEX "news_published_at_idx" ON "news" USING btree ("publishedAt");