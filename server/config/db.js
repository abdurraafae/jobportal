import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Wait for the connection
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log success message when connected
    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
