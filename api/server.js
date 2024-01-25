import { app } from "./app.js";
import { MongoConnection } from "./data/mongoose.js";

MongoConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT:${process.env.PORT} !`);
});
