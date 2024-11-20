import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "healthy!!!",
  });
});

app.listen(4004, () => {
  console.log("Server is running on port 4004 in dev mode");
});
