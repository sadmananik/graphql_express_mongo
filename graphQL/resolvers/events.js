//models
const Event = require("../../models/event");
const { user } = require("./merged");
const User = require("../../models/user");

module.exports = {
    events: () => {
      return Event.find()
      // .populate('creator')
      .then(events => {
        console.log("Result:", events);
        return events.map(event => {
          return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
          };
        });
      })
      .catch(err => {
        console.error("Error : ", err);
        throw err;
      });
    },
    createEvent: (args, req) => {
      console.log("else");

      if(!req.isAuth){
        throw new Error("Unauthenticated Access!");
      }
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.title,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: req.userId
        });
        let createdEvent;
        return event.save()
        .then(result =>{
          console.log("Event ",result);
          createdEvent =  {...result._doc};
          return User.findById(req.userId)
        })
        .then(user => {
          if(!user){
            throw new Error('User not exists.')
          }
          console.log("Event ",event);
          user.createdEvents.push(event._id);
          return user.save();
        })
        .then(result =>{
          return createdEvent;
        })
        .catch(err => {
          console.error("Error : ", err);
          throw err;
        });
      
    }

  };

  //createEvent
  // mutation{
  //   createEvent(eventInput:{title:"Test 3", description:"Desc 3", price:12.2, date:"2021-10-21T20:59:58.862Z"}){
  //     _id
  //     title
  //   }
  // }