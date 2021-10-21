//all resolver

const authResolver = require("./auth");
const eventResolver = require("./events");
const bookResolver = require("./bookings");


const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookResolver
}


module.exports = rootResolver;