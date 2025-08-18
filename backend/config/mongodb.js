import mongoose from "mongoose";

const connectDB = async () => {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    mongoose.connection.on('connected',() => {
        console.log("DB Connected");
    })
    await mongoose.connect(`${process.env.MONGO_URI}/ecommerce`)
}
export default connectDB;
