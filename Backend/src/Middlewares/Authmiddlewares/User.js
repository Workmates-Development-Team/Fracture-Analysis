import jwt from "jsonwebtoken";
import User from "../../Users/models.js";

async function userMiddleware(req, res, next) {
  const token = req?.headers?.authorization;

  if (!token) {
    return res.status(401).json({ msg: "Token not found" });
  }

  const words = token?.split(" ");
  const jwtToken = words[1];

  if (!jwtToken) {
    return res.status(401).json({ msg: "Unauthorized access" });
  }

  try {
    // Verify the JWT token
    const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log(decodedValue);

    if (decodedValue && decodedValue.id) {
      const user = await User.findById(decodedValue.id);
      if (!user) {
        return res.status(400).json({
          success: false,
          msg: "User does not exist",
        });
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ msg: "Unauthorized access" });
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ msg: "Invalid token" });
    } else if (err.name === 'TokenExpiredError') {
      res.status(401).json({ msg: "Token expired" });
    } else {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
}

export default userMiddleware;
