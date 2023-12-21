# EduBot
### An Interactive Educational Web Application for Computer Science Powered by LLMs


## Setup Frontend Server

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd edu-bot
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

## Setup Backend Server
1. If you don't have flask installed, please install flask with pip
   ```bash
   $ pip3 install flask
   ```

2. Navigate to the backend server directory
   ```bash
   $ cd edu-bot/flask_server
   ```

3. Run the backend server
   ```bash
   $ python3 app.py
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000). This application is built based on [OpenAI API Quickstart](https://github.com/openai/openai-quickstart-node), check out the [tutorial](https://platform.openai.com/docs/quickstart) for setting up the frontend server.
