# Campus Lost and Found

A web application where students report lost and found items on campus, and administrators mark items as returned.

**Author:** Abdalla Taha -237001
Seif Islam -230647
**Course:** Web design -CSE5531
**University:** MSA University

## Features

- Report a lost or found item through a form
- Home page with a search bar and the most recent active reports
- Browse all reports on a public page
- Search by item name, description, or location
- Filter by Lost or Found
- Administrator login with a hashed password
- Admin dashboard to mark items as Returned or Active
- Status updates restricted to logged-in administrators
- Data saved in a SQLite database, so reports persist after a server restart

## Technologies

- Node.js and Express (backend)
- SQLite with better-sqlite3 (database)
- express-session and bcryptjs (login and password hashing)
- HTML, CSS, and JavaScript with fetch (frontend)

## Project Structure

```
public/
  index.html      Home page with search and recent reports
  report.html     Report form
  browse.html     Browse, search, and filter
  login.html      Admin login
  admin.html      Admin dashboard
  css/
    style.css     Shared design (navy and amber theme)
  js/
    layout.js     Shared header and footer for every page
src/
  database/
    db.js             Database connection and tables
    create-admin.js   Script to create an admin account
  middleware/
    requireAdmin.js   Blocks non-admin requests
  routes/
    items.js          Item API routes
    auth.js           Login and logout routes
server.js             App entry point
```

## How to Run

1. Install dependencies:

   ```
   npm install
   ```

2. Create an administrator account (see the next section).

3. Start the server:

   ```
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

In GitHub Codespaces, open port 3000 from the **Ports** tab and set its visibility to Public.

## Creating an Administrator Account

The database file is not uploaded to GitHub, so a new copy of the project starts with no admin accounts. Create one before using the dashboard.

1. Open a terminal in the project folder.
2. Run the script with a username and password of your choice:

   ```
   node src/database/create-admin.js USERNAME PASSWORD
   ```

   For example, `node src/database/create-admin.js admin MyPassword123`

3. The terminal should print `Admin created: USERNAME`.
4. Open `/login.html` and log in with the same username and password.
5. After logging in, you are taken to `/admin.html`, where you can mark reports as Returned or Active.

Notes:
- The password is stored as a bcrypt hash, so it cannot be read from the database.
- Usernames must be unique. If the terminal prints `Could not create admin`, that username already exists. Choose a different one.
- Run the command from the main project folder (`/workspaces/sturdy-spork` in Codespaces), not from inside `src`.
- To create more admins, run the same command again with a different username.

## User Interface

The interface uses a shared design so every page looks the same:

- `public/css/style.css` holds the colors, cards, forms, and buttons
- `public/js/layout.js` adds the same header and footer to every page
- The home page has a search bar and shows the most recent active reports
- The Lost and Found links in the menu open the browse page already filtered
- The Report Lost and Report Found links open the form with the right type selected

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/items` | Public | List items. Optional `?search=word` and `?type=Lost` or `Found` |
| POST | `/api/items` | Public | Add a new report |
| PATCH | `/api/items/:id/status` | Admin only | Set status to Active or Returned |
| POST | `/api/auth/login` | Public | Log in as administrator |
| POST | `/api/auth/logout` | Public | Log out |
| GET | `/api/auth/me` | Public | Check whether the visitor is logged in |
| GET | `/api/health` | Public | Check that the server is running |

## Database

**items:** id, item_name, description, location, report_date, report_type (Lost or Found), status (Active or Returned), created_at

**users:** id, username, password (hashed), role

## Security

- Passwords are hashed with bcrypt and never stored as plain text
- Status updates require an administrator session, and the server rejects other requests with 401
- All database queries use parameters, which prevents SQL injection
- Report text is shown with `textContent`, which prevents HTML and script injection
- Input is validated on the server (required fields, report type, status values)
- The database file is excluded from GitHub with `.gitignore`
- No passwords are stored in the code

## Testing

| # | Test | Result |
|---|------|--------|
| 1 | Home page loads with search and recent reports | Passed |
| 2 | Submit a valid report | Passed |
| 3 | Report appears on the browse page | Passed |
| 4 | Data persists after server restart | Passed |
| 5 | Search by keyword | Passed |
| 6 | Search from the home page opens the browse page with results | Passed |
| 7 | Filter by Lost | Passed |
| 8 | Search with no match shows a message | Passed |
| 9 | Report Found link preselects the Found type | Passed |
| 10 | Empty field is rejected | Passed |
| 11 | Invalid report type is rejected | Passed |
| 12 | Admin page redirects when logged out | Passed |
| 13 | Wrong password is rejected | Passed |
| 14 | Status update blocked when logged out | Passed |
| 15 | Admin login shows the dashboard | Passed |
| 16 | Mark as Returned updates the card | Passed |
| 17 | Status change shows on the public page | Passed |
| 18 | Log out blocks the dashboard again | Passed |

Screenshots for each test are in the project report.

## Known Limitations

- There is one role (admin), and admin accounts are created from the command line
- Reports cannot be edited or deleted
- Sessions are stored in memory, so admins are logged out when the server restarts
