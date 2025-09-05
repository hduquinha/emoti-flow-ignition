# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d6b7a317-88a5-4b76-96c2-655c0d17ad31

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d6b7a317-88a5-4b76-96c2-655c0d17ad31) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d6b7a317-88a5-4b76-96c2-655c0d17ad31) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Local Mercado Pago checkout (example)

This project includes a minimal example server that creates a Mercado Pago preference for local testing.

Files added:

- `src/pages/Checkout.tsx` — frontend page that calls `/api/create_preference` and redirects to Mercado Pago.
- `src/pages/CheckoutSuccess.tsx` — simple success page.
- `server/mercadopago-server.js` — example Express server that creates a preference using your Mercado Pago access token.

Quick run (PowerShell):

```powershell
# 1) Install frontend deps
npm install

# 2) Install server deps (in the repo root)
npm install express node-fetch dotenv --save

# 3) Create .env with your Mercado Pago token
echo "MP_ACCESS_TOKEN=YOUR_MP_ACCESS_TOKEN" > .env

# 4) Run the example server
node server/mercadopago-server.js

# 5) In another terminal, run the frontend dev server
npm run dev

# 6) Open http://localhost:5173 and use the pricing buttons; they will navigate to /checkout
```

Security: never commit your real MP access token. In production, create the preference server-side and verify webhooks.
