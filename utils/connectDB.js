import mongoose from "mongoose";

export default async function ConnectDB() {
  try {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(
      "mongodb+srv://andishmandabtin8_db_user:bbHPesGtJDOdUuJ4@firstcluster.hvwfttc.mongodb.net/?retryWrites=true&w=majority&appName=firstCluster"
    );
    console.log("connect to db successfully");
  } catch (error) {
    console.log(error);
  }
}
