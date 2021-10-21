const { singleEvent, user } = require("./merged");


//models
const Booking = require("../../models/booking");
const Event = require("../../models/event");

module.exports = {
    bookings: async (args, req) =>{
      if(!req.isAuth){
        throw new Error("Unauthenticated Access!");
      }else{
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
    }
    },
    bookEvent: async (args, req) => {
      if(!req.isAuth){
        throw new Error("Unauthenticated Access!");
      }else{
        const fetchedEvent = await Event.findOne({_id : args.eventId});
        const booking = new Booking({
          user:  req.userId,
          event: fetchedEvent
        });
        const result = await booking.save();
        return {... result._doc, 
          createdAt : new Date(result.createdAt).toISOString(),
          updatedAt : new Date(result.updatedAt).toISOString()
        }
      }
    },
    cancelBooking: async (args, req) => {
      if(!req.isAuth){
        throw new Error("Unauthenticated Access!");
      }else{
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