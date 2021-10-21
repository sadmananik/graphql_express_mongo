const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    
    const token = authHeader.split(' ')[1]; // Bearer' 'token
    let decodedToken;
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }else{
        try{
            decodedToken =  jwt.verify(token, 'somesupersecrectkey');
        }catch(err){
            req.isAuth = false;
            return next();
        }
    }

    if(decodedToken){
        console.log("decodedToken", decodedToken);
        req.isAuth = true;
        req.userId = decodedToken.userId;
        return next();
    }
}