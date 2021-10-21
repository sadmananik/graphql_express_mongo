const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const User = require("../../models/user");

module.exports = {
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
    login: async ({email, password}) =>{
        const user = await User.findOne({email : email});
        if(!user){
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect!')
        }
        const token = jwt.sign({userId: user._id, email: user.email}, 'somesupersecrectkey', {expiresIn: '1h'});
        return { userId: user._id, token: token, tokenExpiration: 1 }
    }

  };

//createUser
  // mutation{
  //   createUser(userInput: {email: "sadmananik1@gmail.com", password: "test"}){
  //     email
  //   }
  // }