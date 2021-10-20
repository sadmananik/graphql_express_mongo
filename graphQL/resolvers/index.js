const bcrypt = require('bcryptjs');

//models
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");


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
    bookings: async () =>{
      try{
        const bookings = await Booking.find();
        return bookings.map(booking =>{
          return {... booking._doc, 
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt : new Date(booking.createdAt).toISOString(),
            updatedAt : new Date(booking.updatedAt).toISOString()
          }
        })
      }catch(err){
        throw err;
      }
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.title,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '617040b84350d32468a99835'
      });
      let createdEvent;
      return event.save()
      .then(result =>{
        console.log("Event ",result);
        createdEvent =  {...result._doc};
        return User.findById('617040b84350d32468a99835')
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
    },
    createUser: (args) => {
      return User.findOne({email : args.userInput.email}).then(user =>{
        if(user){
          throw new Error('User exists already.')
        }
        return bcrypt.hash(args.userInput.password,12)
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result =>{
        console.log("Result", result);
        return {...result._doc, password : null};
      })
      .catch(err => {
        throw err;
      });
    },
    bookEvent: async args => {
      const fetchedEvent = await Event.findOne({_id : args.eventId});
      const booking = new Booking({
        user: '617040b84350d32468a99835',
        event: fetchedEvent
      });
      const result = await booking.save();
      return {... result._doc, 
        createdAt : new Date(result.createdAt).toISOString(),
        updatedAt : new Date(result.updatedAt).toISOString()
      }
    },
    cancelBooking: async args => {
      try{
        const fetchedBooking = await Booking.findById(args.bookingId).populate('event');
        const event = {
          ...fetchedBooking.event._doc,
          creator: user.bind(this, fetchedBooking.event._doc.creator),
        }
        if(fetchedBooking){
          await Booking.deleteOne({_id : args.bookingId})
        }
        return event;

      }catch(err){
        throw err;
      }
    }

  
  };

//createUser
  // mutation{
  //   createUser(userInput: {email: "sadmananik1@gmail.com", password: "test"}){
  //     email
  //   }
  // }


//createEvent
  // mutation{
  //   createEvent(eventInput:{
  //    title:"Test Title",
  //     description: "Desc 1",
  //     price: 9.99,
  //     date:"2021-10-20T16:20:57.822Z"
  //   }){
  //     title
  //   }
  // }

//bookEvent
  // mutation{
  //   bookEvent(eventId:"61704247f1f87b0748fd204b"){
  //     _id,
  //     createdAt
  //   }
  // }



  //booking
  // query{
  //   bookings{
  //     createdAt
  //     event{
  //       title
  //       creator{
  //         email
  //       }
  //     }
  //   }
  // }

  //cancelBooking
  // mutation{
  //   cancelBooking(bookingId:"61705a8914e43d08e4e5ec6b"){
  //     title
  //     description
  //     price
  //     date
  //   }
  // }