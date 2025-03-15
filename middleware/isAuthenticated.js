const jwt = require("jsonwebtoken");

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token);

        // If No Token Available
        if(!token){
            return res.status(401).json({
                success : false,
                message : "User Not Authenticated",
            });
        }

        // Verify Token 
        const decode = await jwt.verify(token, process.env.SECRET_KEY);

        // if Invalid token
        if(!decode){
            return res.status(401).json({
                success : false,
                message : "Invalid Token"
            })
        }

        // Attach User ID to `req` for further use in controllers
        req.id = decode.userId;

        next();
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = isAuthenticated;