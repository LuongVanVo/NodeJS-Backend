import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Web Service eCommerce start with port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log(`Exit Server Express`));
//   process.exit(0);
// });
