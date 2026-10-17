# PeopleDesk — Employee Management Dashboard

A responsive employee management dashboard built with **HTML5, CSS3, and vanilla JavaScript**. Employee records are persisted in the browser with `localStorage`; no backend, package installation, or build step is required.

## Features

- Dashboard metrics: total employees, active employees, departments, and employees on leave
- Department distribution bars
- Add, edit, and delete employee records
- Search by name, email, department, or role
- Filter by department and employment status
- Export the currently filtered directory as CSV
- Form validation and duplicate-email protection
- Responsive layout for desktop, tablet, and mobile
- Sample records on first launch

## Run locally

1. Download and extract the project ZIP.
2. Open `index.html` in a modern browser.
3. Add or edit records; changes are saved in that browser's local storage.

You can also use the **Live Server** extension in Visual Studio Code for local development.

## Upload to GitHub

### Option A — GitHub website

1. Sign in to [GitHub](https://github.com/).
2. Click **New repository** and name it `employee-management-dashboard`.
3. Choose Public or Private, then create the repository.
4. Select **Add file → Upload files**.
5. Upload `index.html`, `styles.css`, `app.js`, `README.md`, and `.gitignore` from the extracted project folder.
6. Click **Commit changes**.

### Option B — Git command line

Create an empty repository on GitHub first, then run these commands in the project folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Build employee management dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/employee-management-dashboard.git
git push -u origin main
```

If Git asks you to authenticate, use GitHub's supported sign-in or token flow; do not put passwords or tokens in source files.

## Publish with GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings → Pages**.
3. Under build and deployment, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then save.
5. Wait for the Pages deployment and open the URL shown in the Pages settings.

## Data and privacy notes

- Data is stored in the current browser profile and on the current device. It is not synced between users or devices.
- Clearing browser site data can remove employee records. Export CSV backups periodically.
- `localStorage` is appropriate for a demo or small local tool, not a secure production HR system. Anyone with access to the browser profile may be able to inspect its data. Do not store sensitive HR information here.
- A GitHub Pages deployment is static hosting; it does not add authentication or a server database.

## Project structure

```text
employee-management-dashboard/
├── index.html
├── styles.css
├── app.js
├── README.md
└── .gitignore
```
