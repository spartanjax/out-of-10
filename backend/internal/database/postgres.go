package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() {
	var err error
	Pool, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	if err = Pool.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Connected to database")
}

func Migrate() {
	_, err := Pool.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS users (
			id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email         TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			login_streak  INTEGER NOT NULL DEFAULT 0,
			created_at    TIMESTAMPTZ DEFAULT NOW()
		);

		ALTER TABLE users ADD COLUMN IF NOT EXISTS login_streak INTEGER NOT NULL DEFAULT 0;

		CREATE TABLE IF NOT EXISTS ratings (
			id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id     TEXT NOT NULL,
			category_id TEXT NOT NULL,
			score       INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
			rated_date  DATE NOT NULL,
			created_at  TIMESTAMPTZ DEFAULT NOW(),
			UNIQUE (user_id, category_id, rated_date)
		);
	`)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("Database migrated successfully")
}
