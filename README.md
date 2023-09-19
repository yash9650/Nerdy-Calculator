## Steps to run the project.

1. clone the project.
2. npm install in both calculator-view dir and server dir.
3. add env in the server dir with your mysql db connection take refrence from local.env file in server dir.
4. run the migration with `npm run migration:run` make sure you have your db created before running migrations.
5. now to start server run `npm run tsNode`.
6. to start frontend run `npm start`.
