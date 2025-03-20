# SENG401-Project

If you want to deploy the app yourself, first fork the repo (ensure that 'copy the main branch only' is unchecked).

## **Frontend Deployment**
1. Login to [Vercel](https://vercel.com)
2. Select the correct repository from github and deploy the **frontend** directory
3. Navigate to the settings and select the **deployment** branch

## **Backend and Database Deployment**
1. Login to [Railway](https://railway.com)
2. Add a new service from the correct github repository. Set the root directory to be **backend** and the branch to **deployment** in the settings
3. Set the provider to be **Python** and set the deploy command to be ```gunicorn -w 4 -b 0.0.0.0:5000 main:app```
4. Add and deploy a new MySQL service. Using a MySQL interface (CLI, MySQL Workbench, etc.) enter in the tables from [dump.sql](dump.sql)

## **Environment Variable Setup**
1. Navigate to the settings of the backend github deployment
2. In the **Variables** tab, enter in environment variables with this format:
  ```
  TheNews_API_Key=YOUR_API_KEY
  twelvedata_API_KEY=YOUR_API_KEY
  twelvedata_validate_API_KEY=YOUR_API_KEY
  LLM_API_KEY=YOUR_API_KEY
  FMP_API_KEY=YOUR_API_KEY
  DB_HOST=YOUR_DB_HOST
  DB_USER=YOUR_DB_USER
  DB_PASSWORD=YOUR_DB_PASSWORD
  DB_NAME=YOUR_DB_NAME
  DB_PORT=YOUR_DB_PORT
  ```
  You can find the DB information in the MySQL deployment under **Variables**.
  
  **API Key Registration Links:**

   [The News API](https://www.thenewsapi.com/register)
  
   [Twelve Data](https://twelvedata.com/register)
  
   [Google Gemini](https://ai.google.dev/gemini-api/docs)
  
   [FMP](https://site.financialmodelingprep.com/register)
