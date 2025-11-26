# Text-to-Flowchart (MERN)

This repository contains a full-stack MERN app which converts plain text to a flowchart.

## Features included in this scaffold
- Backend: Express, MongoDB (Mongoose)
- Authentication: register/login with JWT
- Parser: improved rule-based parser to convert text lines into nodes & edges
- Frontend: React (Vite) + react-flow-renderer, simple Editor + FlowRenderer
- Save diagrams (authenticated users)

## Quick start
1. Start MongoDB locally (or use a cloud Mongo URI) and configure `server/.env`.
2. Install server deps:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # edit .env to set MONGO_URI and JWT_SECRET
   npm run dev
   ```
3. Install client deps and run dev server:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
4. Open the client in the browser (Vite will print a local URL, e.g. http://localhost:5173)

## Next improvements you can ask me to add
- Export to PNG/SVG
- Drag & drop editing of generated graph and saving the edited graph
- More advanced NLP parser (spaCy or an LLM-powered parser)
- Deploy instructions (Heroku / Railway / Vercel)



## Added features (AI integration next steps)
- Export to PNG & SVG using `html-to-image` (client) — Download buttons included in the FlowRenderer.
- Save edited diagrams: you can move nodes, edit, and click **Save Edited Diagram** (requires the diagram to have been saved originally and user to be logged in).
- Stripe Checkout integration scaffold: server route `/payment/create-checkout-session` and client `PaymentButton` component. Set `STRIPE_SECRET_KEY` and `VITE_STRIPE_PRICE_ID` / `VITE_STRIPE_PUBLISHABLE` in env.

## How to configure Stripe for testing
1. Create a Stripe account and a Price (one-time) or Product with a Price.
2. Set `STRIPE_SECRET_KEY` in `server/.env` and `VITE_STRIPE_PRICE_ID` and `VITE_STRIPE_PUBLISHABLE` in `client/.env` (Vite: use `VITE_` prefix).
3. Start the server and client and click the Upgrade button to go to Stripe's hosted Checkout.

