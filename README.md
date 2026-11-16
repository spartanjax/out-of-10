# out-of-10

Self Improvement App: Tracking yourself on a scale of 1-10.

## Backend

Go 1.25+ / Gin / Postgres. The API listens on port `8080` by default and binds to all interfaces.

### Prerequisites

- Go 1.25+ (with `$GOPATH/bin` on your `PATH`)
- [Air](https://github.com/air-verse/air) for hot reload: `go install github.com/air-verse/air@latest`
- Docker (or a local Postgres 13+ instance)

### 1. Start the database

```bash
docker run -d --name out-of-10-db \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=outof10 \
  -p 5432:5432 --restart unless-stopped postgres:16
```

Check it: `docker exec out-of-10-db pg_isready -U postgres -d outof10`

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and fill in a real `JWT_SECRET`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/outof10?sslmode=disable
JWT_SECRET=<long-random-string>
PORT=8080
```

`.env` is gitignored. Tables (`users`, `ratings`) are created automatically at startup.

### 3. Run

```bash
cd backend
air
```

Air reads `backend/.air.toml`, rebuilds on `.go` changes, and writes the binary to `backend/tmp/main`.
Without Air: `go run ./cmd/server`.

Verify: `curl localhost:8080/health` → `{"status":"ok"}`

### API

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/health` | no |
| POST | `/api/v1/auth/signup` | no |
| POST | `/api/v1/auth/login` | no |
| POST | `/api/v1/ratings` | Bearer token |
| GET | `/api/v1/ratings?category_id=X&days=7` | Bearer token |

`handlers/categories.go` and `handlers/stats.go` exist but are **not yet registered** in `cmd/server/main.go`.
