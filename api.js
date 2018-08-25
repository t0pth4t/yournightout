const express = require('express'),
      bodyParser = require('body-parser'),
      db = require('sqlite');
      // experiences = require('./experiences');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app
    .get('/preferences/:id', async (req, res) => {
        const preferences = await db.get('SELECT * FROM Preferences WHERE id = ?', req.params.id);
        res.send(preferences);
    })
    .post('/preferences',(req, res) => {
      if(!req.body.name || !req.body.user){
        res.send('Missing required data', 400);
      }

      db.run('INSERT INTO Preferences (name, user) VALUES (?,?)', [req.body.name,req.body.user]);
      res.send();
    });

const port = process.env.PORT || 13337;

new Promise((resolve, reject) => {
    resolve();
})
  // First, try to open the database
  .then(() => db.open('./database.sqlite', { Promise }))      // <=
  // Update db schema to the latest version using SQL-based migrations
  .then(() => db.migrate({ force: 'last' }))                  // <=
  // Display error message if something went wrong
  .catch((err) => console.error(err.stack))
  // Finally, launch the Node.js app
  .then(() => {
    app.listen(port)
    console.log(`Listening on port ${port}`);
  });
