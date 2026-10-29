My  Full-Stack Todo List App
Welcome to my full-stack Todo List application! I built this project to practice connecting a visual web page interface to a real cloud database. It includes a clean, minimal design layout and works smoothly on both computers and mobile screens. 

✨What this App Can Do

•User Authentication: Register a new account, log in securely, and log out when finished. Authentication helps users access their accounts.

•Add Tasks: Type a task into the text box and press the "Add Task" button to save it instantly. 

•Check Off Tasks: Click on any task item row to cross it off with a line-through style. 

•Edit Tasks: Click the solid "Edit" button to modify a task name whenever you want.

•Delete Tasks: Click the solid "Delete" button to completely remove a task from the list. 

•Sort Filters: Click the "All", "To do", and "Done" tabs to easily sort and view your items. 

•AI Task Breakdown: Break down larger tasks into smaller, manageable steps with the help of AI, making it easier to organize work and get started.

•Live Syncing: All list items are saved permanently in a cloud database, meaning your tasks won't disappear even if you close the browser tab! 

▶The Tech Stack (How it was built)

•Frontend (The Interface): Built using standard HTML5, clean CSS3 styling, and clear Vanilla JavaScript. It uses premium web fonts (Fraunces & DM Sans) and minimal vector graphics. The interface also includes an AI Task Breakdown feature to help users divide bigger tasks into smaller steps.Login and registration pages to improve the user experience.

•Backend (The Server): Powered by Node.js and Express to route data back and forth smoothly, handle authentication requests, and manage task operations.

•Database (The Storage): Connected securely to a cloud-hosted MongoDB Atlas database cluster using the Mongoose library. 

➤Inside the Project Folders
Here is how the files are structured in this folder: 

todo-app/
├── public/          # Everything the user sees on their screen
│   ├── app.js       # The JavaScript that handles buttons and click actions, and AI Task Breakdown
|   ├── auth.js      # Handles frontend login and registration actions
│   ├── index.html   # The structural skeleton layout of the web page
│   └── style.css    # The design sheets, fonts, colors, and layout spacing
├── package.json     # Configuration file tracking my app's external plugins
├── package lock.json # Project configuration and dependencies
└── server.js        # The brain of the backend server that talks to the database

⚙️ How to Setup and Run this App 

Setup and Run This App Locally

1. Install Node.js

Install a compatible, supported version of Node.js from the official website:

https://nodejs.org/

Check that Node.js and npm are installed by running these commands in your terminal or Command Prompt:

node -v
npm -v

2. Download the Project

Clone the GitHub repository:

git clone https://github.com/Shifa-Khan-15/Todo-App.git

Move into the project folder:

cd Todo-App

3. Install Dependencies

Run the following command to install the required packages:

npm install

This installs the dependencies specified in package.json and uses package-lock.json to help maintain consistent package versions.

4. Configure Environment Variables

Create a local .env file in the project root and add the required environment variables:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000

Replace the example values with your own credentials. Never upload .env or actual secret values to GitHub.

(Note: Never share this .env file with anyone online or upload it to GitHub, to protect your database credentials!) 

5. Start the Application Server!
To bring your server alive, run this line in your terminal prompt: 

node server.js

Once your window displays the message "Server running on http://localhost:3000" and "Connected to MongoDB", open up Google Chrome and type this link into the address bar at the very top: 

http://localhost:3000

6. User Login and Registration

•Register: Create a new account using the registration page.

•Login: Sign in using your registered account details.

•Authentication: The application checks the user’s login status before providing access to protected features.

•Logout: Sign out when you finish using the application.

7. Live Demo

Try the deployed application here:

Live App: https://todo-app-mfnx.onrender.com

8. GitHub Repository

View the complete source code here:

GitHub: https://github.com/Shifa-Khan-15/Todo-App
