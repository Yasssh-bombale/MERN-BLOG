import mongoose from "mongoose";

export const MongoConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Mern-Blog",
    })
    .then((c) => console.log(`MongoDB Connected ! ${c.connection.name}`))
    .catch((error) =>
      console.log(`ERROR: While connecting to MongoDB ${error}`)
    );
};
