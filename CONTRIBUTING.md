# Contributing to LDGR

This guide takes you from a brand-new computer to a fully running LDGR
development environment — backend, web, and CLI all working together.

No prior setup is assumed. Follow every step in order.

---

## Table of Contents

1. [Organise your machine](#1-organise-your-machine)
2. [Install the prerequisites](#2-install-the-prerequisites)
3. [Clone the repository](#3-clone-the-repository)
4. [Start the database](#4-start-the-database)
5. [Run the backend](#5-run-the-backend)
6. [Run the web](#6-run-the-web)
7. [Run the CLI](#7-run-the-cli)
8. [Verify everything works](#8-verify-everything-works)
9. [How we work](#9-how-we-work)

---

## 1. Organise your machine

Before installing anything, decide where your code will live.

Do not put projects on your Desktop or in Downloads. Create a dedicated folder
for all your development work. This keeps things clean and professional.

**macOS / Linux:**
\`\`\`bash
mkdir -p ~/Developer
cd ~/Developer
\`\`\`

**Windows** — open PowerShell as a normal user (not Administrator):
\`\`\`powershell
mkdir C:\Developer
cd C:\Developer
\`\`\`

Everything from this point forward happens inside this folder.

---

## 2. Install the prerequisites

LDGR needs four things installed on your machine:

| Tool | What it does | Required version |
|---|---|---|
| Git | Version control | Any recent version |
| Java 21 | Runs the backend | Exactly 21 (LTS) |
| Node.js | Runs the web and CLI | 20 or higher |
| Docker Desktop | Runs the database | Any recent version |

Install them in this order.

---

### Git

**macOS:**
\`\`\`bash
xcode-select --install
\`\`\`
A dialog will appear. Click Install. Wait for it to finish.

Verify:
\`\`\`bash
git --version
\`\`\`

**Windows:**
Download from https://git-scm.com/download/win and run the installer.
Accept all defaults. When asked about line endings, choose
"Checkout as-is, commit as-is".

Verify — open a new PowerShell window:
\`\`\`powershell
git --version
\`\`\`

**Linux (Ubuntu/Debian):**
\`\`\`bash
sudo apt update && sudo apt install -y git
\`\`\`

Verify:
\`\`\`bash
git --version
\`\`\`

---

### Java 21

Do not install Java from Oracle. Use SDKMAN on macOS/Linux or
Adoptium on Windows — both give you clean, manageable Java installs.

**macOS / Linux — install SDKMAN first:**
\`\`\`bash
curl -s "https://get.sdkman.io" | bash
\`\`\`

Close your terminal. Open a new one. Then install Java 21:
\`\`\`bash
sdk install java 21.0.7-tem
\`\`\`

Verify:
\`\`\`bash
java -version
\`\`\`
You should see \`openjdk version "21"\`.

**Windows:**
Download the Java 21 installer from https://adoptium.net
Choose: **Temurin 21 (LTS)** → **Windows** → **x64** → **.msi**

Run the installer. Accept all defaults.

Open a new PowerShell window and verify:
\`\`\`powershell
java -version
\`\`\`
You should see \`openjdk version "21"\`.

---

### Node.js

**macOS — using Homebrew:**

Install Homebrew first if you do not have it:
\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

Then install Node:
\`\`\`bash
brew install node
\`\`\`

**Linux (Ubuntu/Debian):**
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
\`\`\`

**Windows:**
Download from https://nodejs.org — choose the **LTS** version.
Run the installer. Accept all defaults.

Verify on all platforms:
\`\`\`bash
node --version
npm --version
\`\`\`
Both should print version numbers. Node should be 20 or higher.

---

### Docker Desktop

Docker runs the PostgreSQL database inside a container so you do not need
to install or configure PostgreSQL directly.

Download Docker Desktop for your platform from https://www.docker.com/products/docker-desktop

- **macOS** — open the \`.dmg\`, drag Docker to Applications, launch it.
- **Windows** — run the installer, accept defaults, restart when asked.
- **Linux** — follow the instructions at https://docs.docker.com/desktop/install/linux-install/

After installing, open Docker Desktop and wait until it says **"Engine running"**
in the bottom left corner. Docker must be running before you continue.

Verify:
\`\`\`bash
docker --version
docker compose version
\`\`\`

---

## 3. Clone the repository

Navigate to your Developer folder:

**macOS / Linux:**
\`\`\`bash
cd ~/Developer
\`\`\`

**Windows:**
\`\`\`powershell
cd C:\Developer
\`\`\`

Clone LDGR:
\`\`\`bash
git clone https://github.com/ldgr/ldgr.git
cd ldgr
\`\`\`

You now have the full monorepo on your machine:
\`\`\`text
ldgr/
├── backend/
├── cli/
├── web/
└── docker-compose.yml
\`\`\`

---

## 4. Start the database

LDGR uses PostgreSQL. Docker runs it for you.

From the root of the repository:
\`\`\`bash
docker compose up -d
\`\`\`

This downloads the PostgreSQL image (first time only — takes a minute) and
starts the database in the background.

Verify it is running:
\`\`\`bash
docker compose ps
\`\`\`

You should see \`ldgr-postgres\` with status \`running\`.

The database is now available at \`localhost:5432\`. You do not need to create
any tables — the backend does that automatically on first startup.

---

## 5. Run the backend

The backend needs three environment variables to start. Create a \`.env\` file
inside the \`backend/\` folder.

**macOS / Linux:**
\`\`\`bash
cat > backend/.env << 'ENVEOF'
LDGR_JWT_SECRET='LdgrDevJwtSecret2026!LongEnoughForHS256'
GOOGLE_CLIENT_ID='your-google-client-id'
GOOGLE_CLIENT_SECRET='your-google-client-secret'
ENVEOF
\`\`\`

**Windows** — create the file \`backend\.env\` in Notepad or any text editor
with this content:
\`\`\`
LDGR_JWT_SECRET=LdgrDevJwtSecret2026!LongEnoughForHS256
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

> **Google credentials** are only needed if you want to test Google OAuth
> locally. For basic login and registration they can be left as placeholder
> values. Ask a maintainer if you need real credentials for OAuth testing.

Now start the backend:

**macOS / Linux:**
\`\`\`bash
cd backend
./run-local.sh
\`\`\`

**Windows:**
\`\`\`powershell
cd backend
$env:LDGR_JWT_SECRET='LdgrDevJwtSecret2026!LongEnoughForHS256'
$env:GOOGLE_CLIENT_ID='your-google-client-id'
$env:GOOGLE_CLIENT_SECRET='your-google-client-secret'
./mvnw spring-boot:run
\`\`\`

The first run downloads all Java dependencies — this takes a few minutes.
Subsequent starts are fast.

You will know it is ready when you see:
\`\`\`
Started BackendApplication in X seconds
\`\`\`

The backend is now running at \`http://localhost:8080\`.

---

## 6. Run the web

Open a **new terminal window**. Keep the backend running in the previous one.

**macOS / Linux:**
\`\`\`bash
cd ~/Developer/ldgr/web
npm install
npm run dev
\`\`\`

**Windows:**
\`\`\`powershell
cd C:\Developer\ldgr\web
npm install
npm run dev
\`\`\`

\`npm install\` downloads all dependencies (first time only).
\`npm run dev\` starts the development server.

You will see:
\`\`\`
VITE ready in Xms
➜  Local: http://localhost:5173/
\`\`\`

Open \`http://localhost:5173\` in your browser. You should see the LDGR web
interface.

---

## 7. Run the CLI

Open another **new terminal window**.

**macOS / Linux:**
\`\`\`bash
cd ~/Developer/ldgr/cli
npm install
npm run build
npm link
\`\`\`

**Windows:**
\`\`\`powershell
cd C:\Developer\ldgr\cli
npm install
npm run build
npm link
\`\`\`

\`npm link\` installs the \`ldgr\` command globally on your machine so you can
run it from anywhere.

Verify:
\`\`\`bash
ldgr --help
\`\`\`

You should see the list of available commands.

---

## 8. Verify everything works

At this point you should have three terminal windows open:

| Terminal | What is running |
|---|---|
| 1 | Backend — \`http://localhost:8080\` |
| 2 | Web — \`http://localhost:5173\` |
| 3 | CLI — ready for commands |

Run through this checklist:

**Register an account via the CLI:**
\`\`\`bash
ldgr register
\`\`\`
Follow the prompts. Enter a name, email, and password.

**Log in:**
\`\`\`bash
ldgr login
\`\`\`

**Confirm you are authenticated:**
\`\`\`bash
ldgr whoami
\`\`\`
You should see your name and email printed back.

**Open the web interface:**
Go to \`http://localhost:5173\` in your browser and log in with the same
credentials.

If all three work — you are set up. LDGR is running on your machine exactly
as it runs in development.

---

## 9. How we work

**Branching:**
- \`main\` is always stable.
- Create a branch for every change: \`git checkout -b your-feature-name\`
- Branch names are lowercase with hyphens: \`add-organisation-api\`, \`fix-token-expiry\`

**Commits:**
- One logical change per commit.
- Commit messages are lowercase and descriptive:
  - \`feat: add organisation membership endpoint\`
  - \`fix: reject expired refresh tokens\`
  - \`docs: update authentication flow\`

**Pull requests:**
- Open a PR against \`main\`.
- Describe what changed and why — not how (the code shows how).
- Keep PRs small. A focused 200-line PR gets reviewed faster than a sprawling
  1000-line one.

**Code style:**
- Backend follows standard Java conventions. IntelliJ IDEA defaults are fine.
- Web and CLI use TypeScript strict mode. Run \`npm run lint\` before pushing.

**Before pushing:**
\`\`\`bash
# Backend
cd backend && ./mvnw test

# Web
cd web && npm run lint

# CLI
cd cli && npm run build
\`\`\`

---

If anything in this guide did not work, open an issue and describe exactly
where it failed and what error you saw. We will fix the guide.
