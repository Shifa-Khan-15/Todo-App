My  Full-Stack Todo List App
Welcome to my full-stack Todo List application! I built this project to practice connecting a visual web page interface to a real cloud database. It includes a clean, minimal design layout and works smoothly on both computers and mobile screens. 

✨What this App Can Do•Add Tasks: Type a task into the text box and press the "Add Task" button to save it instantly. 

•Check Off Tasks: Click on any task item row to cross it off with a line-through style. 

•Edit Tasks: Click the solid "Edit" button to modify a task name whenever you want.

•Delete Tasks: Click the solid "Delete" button to completely remove a task from the list. 

•Sort Filters: Click the "All", "To do", and "Done" tabs to easily sort and view your items. 

•Live Syncing: All list items are saved permanently in a cloud database, meaning your tasks won't disappear even if you close the browser tab! 

▶The Tech Stack (How it was built)

•Frontend (The Interface): Built using standard HTML5, clean CSS3 styling, and clear Vanilla JavaScript. It uses premium web fonts (Fraunces & DM Sans) and minimal vector graphics. 

•Backend (The Server): Powered by Node.js and Express to route data back and forth smoothly. 

•Database (The Storage): Connected securely to a cloud-hosted MongoDB Atlas database cluster using the Mongoose library. 

➤Inside the Project Folders
Here is how the files are structured in this folder: 

todo-app/
├── public/          # Everything the user sees on their screen
│   ├── app.js       # The JavaScript that handles buttons and click actions
│   ├── index.html   # The structural skeleton layout of the web page
│   └── style.css    # The design sheets, fonts, colors, and layout spacing
├── .env             # Hidden text file holding my private database password
├── package.json     # Configuration file tracking my app's external plugins
└── server.js        # The brain of the backend server that talks to the database

⚙️ How to Setup and Run this App Locally

1. Install Node.js
Make sure you have Node.js installed on your computer. If you are using an older operating system like Windows 7, ensure you install Node.js version 13.14.0 so everything functions correctly. 

2. Download the App Packages
Open your terminal or Command Prompt window, move into this project folder using the cd command, and run this single command to download the exact project requirements: 

npm install express@4.17.1 mongoose@5.13.15 dotenv@8.2.0

3. Configure Your Environment Passwords
Create a text file in this root directory named .env and paste your MongoDB connection link right inside it like this: 

env:
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/todo_app?retryWrites=true&w=majority
PORT=3000

(Note: Never share this .env file with anyone online or upload it to GitHub, to protect your database credentials!) 

4. Start the Application Server!
To bring your server alive, run this line in your terminal prompt: 

node server.js

Once your window displays the message "Server running on http://localhost:3000" and "Connected to MongoDB", open up Google Chrome and type this link into the address bar at the very top: 

http://localhost:3000

📚What I Learned from This Project

•How CRUD Works: I learned how to create, read, update, and delete data rows dynamically between a client web browser and a cloud database. 

•State Management: I learned how to keep track of a single list array locally in the browser memory and update the text view cleanly whenever a task state changes. 

•Environment Isolation: I practiced isolating crucial passwords away from public source files for safety. 
