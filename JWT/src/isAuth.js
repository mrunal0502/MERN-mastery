import jwt from "jsonwebtoken";

const isAuth = (req) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    throw new Error("You need to Login");
  }

  const token = authorization.split(" ")[1];

  const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  return userId;
};

export default isAuth;
