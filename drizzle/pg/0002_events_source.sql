ALTER TABLE "events" ADD COLUMN "endDate" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "source" varchar(100) DEFAULT 'community' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "sourceUrl" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "externalId" varchar(100);--> statement-breakpoint
CREATE UNIQUE INDEX "events_external_id_unique" ON "events" USING btree ("externalId");--> statement-breakpoint
CREATE INDEX "events_date_idx" ON "events" USING btree ("date");
