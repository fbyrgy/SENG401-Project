# SENG401-Project

## **Frontend Setup**
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies (only needed the first time):
   ```bash
   npm install
   npm install recharts
   npm install react-resizable
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
## **Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Ensure all dependencies are installed:
   ```bash
   pip install -r requirements.txt # OR 
   python -m pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   python app.py
   ```

## **Database Setup (MySQL)**
1. Create and switch to the database
   ```sql
   CREATE DATABASE finance_app;
   use finance_app;
   ```
2. Create the tables
   ```sql
   CREATE TABLE users (
   user_id INT AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(100) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE watchlist (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   stock_ticker VARCHAR(10) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   );
   ```

## **Environment Variable Setup**
1. Create the file
   ```bash
   cd backend
   touch .env # Mac/Linux
   new-item .env # Windows 

2. Edit the file with your secrets
   ```
   TheNews_API_Key=YOUR_API_KEY
   twelvedata_API_KEY=YOUR_API_KEY
   LLM_API_KEY=YOUR_API_KEY
   FMP_API_KEY=YOUR_API_KEY
   DB_PASSWORD=YOUR_SECRET
   ```
   **API Key Registration Links:**

   [The News API](https://www.thenewsapi.com/register)

   [Twelve Data](https://twelvedata.com/register)

   [Google Gemini](https://ai.google.dev/gemini-api/docs)

   [FMP](https://site.financialmodelingprep.com/register)

