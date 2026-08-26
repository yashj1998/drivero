import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://infoyashjoshi7355_db_user:d4sUU0f64tJUKxoS@cluster0.th9twdp.mongodb.net/drivero?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
}
