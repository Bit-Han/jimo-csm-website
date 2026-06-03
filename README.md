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
npm install
npm run dev
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
