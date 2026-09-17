CREATE TABLE `commerces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`instagram` varchar(100),
	`hours` varchar(100),
	`description` text,
	`lat` varchar(50),
	`lng` varchar(50),
	`coordsJson` text,
	`photoUrl` text,
	`photoKey` varchar(255),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commerces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50),
	`type` varchar(100) NOT NULL,
	`address` varchar(255),
	`description` text NOT NULL,
	`status` enum('pending','resolved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`date` varchar(100),
	`time` varchar(100),
	`location` varchar(255),
	`organizer` varchar(255),
	`description` text,
	`attendees` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `muralPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`category` varchar(100) DEFAULT 'Geral',
	`message` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `muralPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`targetType` enum('commerce','service') NOT NULL,
	`targetId` int NOT NULL,
	`targetName` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`type` varchar(100) NOT NULL,
	`message` text NOT NULL,
	`status` enum('pending','resolved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usefulPhones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`phone` varchar(50) NOT NULL,
	`address` varchar(255),
	`hours` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usefulPhones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
