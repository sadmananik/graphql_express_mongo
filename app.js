const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");
require("dotenv").config();

const graphqlSchema = require("./graphQL/schema/index")
const graphqlResolver = require("./graphQL/resolvers/index")



const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/hearbeat', (req, res) => {
    res.status(200);
    res.json({"Status": "ok"});
})

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true

}));

// Database Connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(
      "==============Mongodb Database Connected Successfully=============="
    )
  )
  .catch((err) => {
    console.log("Database Not Connected !!!");
    console.error("Database Connection Error :: ", err);
  });


// Run Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
