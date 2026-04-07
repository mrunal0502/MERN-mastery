import jwt from "jsonwebtoken";

const createAccessAndRefreshToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

export default createAccessAndRefreshToken;
