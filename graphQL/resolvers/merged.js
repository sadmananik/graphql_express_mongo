//models

const Event = require("../../models/event");
const User = require("../../models/user");

const user = userId => {
    return User.findById(userId)
      .then(user => {
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents)};
      })
      .catch(err => {
        console.log("user error", err);
        throw err;
      })
  };

  const singleEvent = async eventId => {
    try{
      const event = await Event.findById(eventId);
        return {... event._doc, 
          creator: user.bind(this, event.creator)
        };
    }catch(err){
      throw err;
    }
  };
  
  const events = async eventIds => {
    try{
    const events = await Event.find({_id : {$in: eventIds}})
      events.map(event => {
          return { 
            ...event._doc, 
            creator: user.bind(this, event.creator)
          };
        });
        return events;
    } catch (err){
        console.log("events error", err);
        throw err;
      }
  };


  exports.user = user;
  exports.singleEvent = singleEvent;
