# Next.js Starter (Modular)

A flexible Next.js starter for building frontend or fullstack applications.

## Features

* Next.js App Router
* Tailwind CSS
* Modular architecture
* Optional integrations (Supabase, Auth, DB)

## Usage

### Frontend only

No setup required. Just run:

```bash
pnpm install
pnpm run dev
```

### Enable Supabase

1. Add env variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

2. Use the module:

```ts
import { createSupabaseClient } from "@/lib/modules/supabase/client";
```

## Philosophy

* Keep core minimal
* Add features only when needed
* Avoid tight coupling


## env 
# For creating seed and superadmin
SEED_ADMIN_EMAIL=jimorealestate45@gmail.com
SEED_ADMIN_PASSWORD=JimorealEstate45$
SEED_ADMIN_NAME= Onyekachi John