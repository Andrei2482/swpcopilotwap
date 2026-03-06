# Copilot — Cloudflare Pages Setup Guide

This guide walks you through deploying the **SwordigoPlus Copilot** app to Cloudflare Pages using only the web dashboard and GitHub — **no CLI required**.

---

## Prerequisites

- A **Cloudflare account** — [dash.cloudflare.com](https://dash.cloudflare.com)
- A **GitHub account** with the `SwordigoPlus Digital Web` repository pushed

---

## Step 1 — Push the code to GitHub

1. In your GitHub repository, make sure the `copilot/` folder exists at the root of the repo alongside `frontend/` and `backend/`.
2. Commit and push all changes.

---

## Step 2 — Create a Cloudflare Pages project

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages).
2. Click **Create a project**.
3. Choose **Connect to Git** → select **GitHub**.
4. Authorize Cloudflare and pick the `SwordigoPlus Digital Web` repository.
5. Click **Begin setup**.

---

## Step 3 — Configure the build settings

Fill in the form exactly as shown:

| Field | Value |
|---|---|
| **Project name** | `swordigoplus-copilot` |
| **Production branch** | `main` |
| **Framework preset** | None (or Vite) |
| **Build command** | `cd copilot && npm install && npm run build` |
| **Build output directory** | `copilot/dist` |
| **Root directory** | *(leave blank)* |

> [!IMPORTANT]  
> The **Build output directory** must be `copilot/dist` (not just `dist`) because the repo root contains multiple apps.

---

## Step 4 — Save and deploy

1. Click **Save and Deploy**.
2. Wait for the build to complete — usually under 2 minutes. ✅
3. Your Copilot app will be live at `https://swordigoplus-copilot.pages.dev`.

---

## Step 5 — Set up a custom subdomain (optional)

To serve Copilot on `copilot.swordigoplus.com`:

1. In your Cloudflare Pages project, go to **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter `copilot.swordigoplus.com`.
4. Cloudflare will add the DNS record automatically if your domain is on Cloudflare. Click **Activate domain**.

---

## Step 6 — Environment variables (when backend is ready)

When you're ready to connect to the backend API, add these in **Pages → Settings → Environment variables**:

| Variable | Example value |
|---|---|
| `VITE_API_URL` | `https://api.swordigoplus.com` |

> [!NOTE]  
> All Vite environment variables **must** start with `VITE_` to be exposed to the browser. Set these for both **Production** and **Preview** environments.

---

## Subsequent deployments

Every `git push` to the `main` branch will automatically trigger a new build and deploy. Preview deployments are created automatically for pull requests.

---

## Local development

To run the Copilot app locally:

```bash
cd copilot
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Build fails with "cannot find module" | Check the build command includes `cd copilot &&` before `npm install` |
| Blank page after deploy | Ensure build output directory is `copilot/dist` |
| Routes 404 on refresh | In Pages Settings → Functions, add a **redirect rule**: `/*` → `/index.html` with status `200` |
| CORS errors from backend | Add `copilot.swordigoplus.com` to the backend's `ALLOWED_ORIGINS` in `wrangler.toml` |
