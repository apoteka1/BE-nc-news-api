# __NC News__

__Overview__

A social news and discussion website.
Users can publish, rate and discuss articles, as well as curate their own bespoke reading list.

__Links__

Deployed version - 

Front-end repository - https://github.com/apoteka1/FE-nc-news.git


__To run locally__

- Requires Node v17 +
- Requires PostgreSQL 14


To set up repo locally: 
- run  ```git clone https://github.com/apoteka1/be-nc-news.git``` in terminal in desired directory.
- cd into repo.
- run  ```npm install``` to install dependencies.  


To create .env files:
- in root of repo, create files named '.env.development' and '.env.test'
- in '.env.development' write ```PGDATABASE=nc_news```
- in '.env.test' write ```PGDATABASE=nc_news_test```


To create and seed database:
- run ```npm run setup-dbs``` in root folder to set up databases
- run ```npm run seed``` in root folder to seed local database


To run tests:
- run ```npm test``` in root folder


To start server locally on port 9090:
- run ```npm start```





