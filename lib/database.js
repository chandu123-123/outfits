import  mongoose from 'mongoose';

export async function dbconnection() {
  await mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Error connecting to database:", err);
    });
}
