# Keyboardz — Multiplayer typing game

Keyboardz is multiplayer typing test game where users can compete against each
other in real-time. Project is built with [Next.js](https://nextjs.org),
[Tailwind](https://tailwindcss.com/), [Drizzle ORM](https://orm.drizzle.team), [NextAuth](https://next-auth.js.org/) and
[TypeScript](https://typescriptlang.org/).

![Keyboardz](https://utfs.io/f/af6c1683-f5b0-4007-a3a2-3b7614af50e2_keyboardz.jpg)

## Features

- Single-player typing tests
- Multiplayer typing tests with Socket.io
- Typing stats
- Multiple themes
- etc...

## Usage

Clone this repo

```bash
git clone https://github.com/miljan-code/keyboardz.git
```

Install necessary dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

Fill up the environment variables

```env
NODE_ENV="development"

DATABASE_URL=""

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Demo

Try it out here (Multiplayer not available in demo because project is hosted on Vercel Serverless, so websockets not available)

[https://keyboardz.miljan.xyz/](https://keyboardz.miljan.xyz/)
