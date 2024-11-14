# Recommended Database Configuration
Database Name: `products`
Username: `postgres` (or your preferred PostgreSQL username)
Password: `postgres` (or your preffered PostgreSQL)
Host: `localhost`
Port: `5432` (default for PostgreSQL)

#Note: These details will be used throughout the setup process. If you prefer different configurations, ensure you remember the custom values to update the .env file in step 9.

# Note: Ctrl + left click to go directly to that url

# Step 1. Install Node.js:
Node.js is required to run the backend, frontend, and manage project dependencies. To install Node.js, follow the instructions on the official Node.js website.
-> https://nodejs.org/en

# Step 2. Install PostgreSQL:
PostgreSQL is the database used for this project. You'll need to install it by following the instructions on the official PostgreSQL website.
During installation, remember the PostgreSQL username, password, host, and database name as these will be needed later.
-> https://www.postgresql.org/download/

# Step 3. Install an IDE
We recommend using Visual Studio Code or any other IDE that supports JavaScript, TypeScript, and Node.js development.
-> https://code.visualstudio.com/

# Step 4. Set up PostgreSQL Environment Variables
After installing PostgreSQL, add the PostgreSQL bin folder to your PATH for easier access. Here’s a tutorial on setting up PATH for PostgreSQL.
-> https://www.youtube.com/watch?v=3GWZUNCDqNo&ab_channel=MimAhmed

# Step 5. PostgreSQL Setup:
Open your terminal (make sure PostgreSQL is running).
You can make sure that PostgreSQL is running by running the command
-> `pg_isready`

# Step 6. PostgreSQL Connection:
Run the following command to connect to PostgreSQL:
-> `psql -h "Your host name" -p "Port number" -U "Your username" -d "Your database name"`

For Example:
`psql -h localhost -p 5432 -U postgres -d postgres`
-> You will be prompted for a password. Enter the password you created during the installation of PostgreSQL.

# Step 7. Creating a New Database:
Once you're connected to PostgreSQL, create a new database by running the following command:
-> `CREATE DATABASE "DB NAME";`

For Example
-> `CREATE DATABASE products;`
It's recommended to create a database named "products" as it simplifies the setup process, eliminating the need for additional configuration.

# Step8. Restoring the Dump File:
Then you can just give this command to restore the dump file
-> `pg_restore -h localhost -U postgres -p 5432 -d dummy dump/backup.sql`

                                        (Or)

You can just Create and Restore the db with this single line
`psql -h "Your host name" -p "Your port no" -U "Your user name" -d "Database created during installatio" -c "CREATE DATABASE "Your DB NAME";" ; pg_restore -h "Host Name" -U "User name" -p "Port No" -d "New DB" dump/backup.sql`

For Example:
`psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE products;" ; pg_restore -h localhost -U postgres -p 5432 -d products dump/backup.sql`

# Step 9: Modifying Database Details in the Backend
To modify the database configuration, open the `.env` file located in the `backend` folder. You can do this in the following way:
Navigate to the `backend/` directory in your project folder and find the `.env` file. Open it in any text editor.

# Step 10. Run both frontend and backend in production mode:
To run the frontend and backend in production mode, follow these steps:
If you are a first-time user run this command to start both frontend and backend in production mode
-> `npm run start-firstime`

# Step11. If you are not you can just run
-> `npm run start`

There you go both starts running in production mode.