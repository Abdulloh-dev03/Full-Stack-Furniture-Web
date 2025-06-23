import jwt from 'jsonwebtoken';
import { Response } from 'express';

const accessToken = (
  user: { id: string; role: string },
  res: Response
) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

 res.cookie("authToken", token, {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production", // secure only in prod
});



  return token;
};

export default accessToken;
