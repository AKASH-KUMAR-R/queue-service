# Queue Service (QaaS)

A Queue‑as‑a‑Service platform that lets projects enqueue jobs into named queues and process them through worker SDKs, with a React dashboard for visibility and insights.

## Product snapshot

- Dashboard pages for queues, jobs, workers, insights, and settings (`client/src/pages/*`).
- Job lifecycle with retries, heartbeats, and job events (`api/src/services/job/job.service.ts`).
- Queue insights cron and monitoring scheduler (`api/src/scheduler/*`, `api/src/services/monitor/monitor.service.ts`).
- Producer/worker SDKs for enqueueing and processing jobs (`producer-sdk`, `worker-sdk`).

> **Screenshots/GIFs:** _Add dashboard screenshots here (Queues, Jobs, Insights, Workers)._

## Architecture at a glance

**Client → API → Database**, with Producer/Worker SDKs talking to the API.

```
Producer SDK ─┐
             ├─> API (Express + TS + ZenStack/Prisma) ─> PostgreSQL
Worker SDK ───┘
                         ↑
                     React Dashboard
```

> **Diagram:** _Add a system architecture diagram here._

## Tech stack

- **API:** Express, TypeScript, Passport, Pino (`api/package.json`)
- **DB:** PostgreSQL via ZenStack + Prisma (`api/schema.zmodel`)
- **Client:** React, Vite, TanStack Query (`client/package.json`)
- **SDKs:** TypeScript + axios (`producer-sdk`, `worker-sdk`)
- **CI/CD:** GitHub Actions → Azure Static Web Apps (client), Azure Web App (API)

## Repository structure

| Path            | Purpose                          |
| --------------- | -------------------------------- |
| `api/`          | Express + TypeScript backend     |
| `client/`       | React dashboard                  |
| `producer-sdk/` | Producer SDK for enqueueing jobs |
| `worker-sdk/`   | Worker SDK for processing jobs   |

## Local setup

### Prerequisites

- Node.js (CI uses **Node 24.x** for the API workflow)
- PostgreSQL database

### API

```bash
cd api
npm install
```

Create `api/.dev.env` according to provided `.env.example` file

Generate the ZenStack/Prisma client and run migrations:

```bash
npm run generate
npm run migrate:dev
```

Run the API:

```bash
npm run dev
```

Run the monitor scheduler (separate process):

```bash
npm run scheduler:dev
```

### Client

```bash
cd client
npm install
npm run dev
```

Create `client/.env` according to the provided`.env.example`

### SDKs

```bash
cd producer-sdk
npm install
npm run build

cd ../worker-sdk
npm install
npm run build
```

## Configuration notes

- The API loads `.dev.env` or `.prod.env` based on `NODE_ENV` (`api/src/config/dotenv.config.ts`).
- The client reads `VITE_BACKEND_BASE_URL` from `import.meta.env` (`client/src/shared/api/axiosConfig.ts`).

## Data model (ZenStack/Prisma)

Core entities from `api/schema.zmodel` / `api/prisma/schema.prisma`:

| Model                               | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `Project`                           | Owner container for queues and jobs        |
| `Environment`                       | Environment namespace per project          |
| `Queue`                             | Named queue with optional rate limiting    |
| `Job`                               | Payload + status + attempts + scheduling   |
| `JobEvents`                         | Lifecycle events for jobs                  |
| `ApiKey`                            | API key records for worker/producer access |
| `QueueMetrics`                      | Active/failed/completed counters           |
| `QueueInsights` / `ProjectInsights` | Aggregated hourly insights                 |
| `WorkerStatus`                      | Worker heartbeat and active job state      |
| `QueueRateLimiter`                  | Windowed queue rate limiting               |
| `CronState`                         | Last run tracking for scheduled tasks      |

## Job lifecycle (worker flow)

1. **Producer creates a job** via `/api/worker/job/create` using `x-api-key` and `x-producer-id`.
2. **Worker polls** `/api/worker/job/next-job?queue_label=...` with `x-api-key` and `x-worker-id`.
3. **API dequeues** a job with `FOR UPDATE SKIP LOCKED`, marks it `IN_PROGRESS`, and increments attempts.
4. **Worker sends heartbeats** every 4 seconds (`worker-sdk`), and API records a `JOB_HEARTBEAT`.
5. **Completion** calls `/mark-as-completed/:id` and records `JOB_COMPLETED`.
6. **Failure** calls `/mark-as-failed/:id`. If attempts < 5, the job is requeued; otherwise it fails.
7. **Monitoring** detects timeouts or dead heartbeats and requeues/fails accordingly.

## API surface & auth

| Route group         | Purpose                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| `/api/auth/*`       | Auth endpoints                                                                         |
| `/api/dashboard/*`  | Dashboard‑oriented CRUD (queues, jobs, users, projects, environments, metrics, events) |
| `/api/worker/job/*` | Worker/producer API (enqueue, next‑job, heartbeat, completion)                         |

**Auth behavior:**

Dashboard routes use JWT (cookie) via `passport-jwt`. Worker/producer routes use API key auth (`passport-custom`) plus headers: `x-api-key`, `x-producer-id` (producer routes), and `x-worker-id` (worker routes).

## SDK usage

**Producer**

```ts
import { createProducer } from "@qaas/producer-sdk";

const producer = createProducer({
    baseUrl: "http://localhost:3000",
    apiKey: "<api-key>",
    metaData: { label: "my-producer" },
});

await producer.addJob("email-queue", {
    payload: { userId: "123" },
    timeout_ms: 30000,
    priority: 5,
});
```

**Worker**

```ts
import { createWorker } from "@qaas/worker-sdk";

const worker = createWorker({
    baseUrl: "http://localhost:3000",
    apiKey: "<api-key>",
    queueLabel: "email-queue",
    pollingTime: 1000,
    concurrency: 1,
});

await worker.run(async (payload, shouldCancel) => {
    if (shouldCancel?.()) return;
    // do work with payload
});
```

## Scheduler & insights

- **Queue insights cron** runs every minute (`api/src/scheduler/insights/index.ts`) and recomputes queue/project insight buckets (`api/src/services/cron.service.ts`).
- **Monitor scheduler** runs every 3 seconds (`api/src/scheduler/index.ts`) to detect timeout or dead‑heartbeat jobs and requeue/fail them.

## CI/CD

| Workflow                      | Purpose                                         | Notes                               |
| ----------------------------- | ----------------------------------------------- | ----------------------------------- |
| `azure-static-web-apps-*.yml` | Deploys the **client** to Azure Static Web Apps | Uses `VITE_BACKEND_BASE_URL` secret |
| `main_dev-qaas-server.yml`    | Builds and deploys **API** to Azure Web App     | Uses Azure login secrets            |

> Both workflows are currently **manual** (`workflow_dispatch`).
