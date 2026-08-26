import mongoose from 'mongoose';

export async function connectDB(retries = 5, delay = 3000) {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://infoyashjoshi7355_db_user:d4sUU0f64tJUKxoS@cluster0.th9twdp.mongodb.net/drivero?retryWrites=true&w=majority';

  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host} | Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB Error] Attempt ${i}/${retries} failed to connect: ${error.message}`);
      if (i < retries) {
        console.log(`[MongoDB] Retrying connection in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('[MongoDB Error] All connection attempts failed. Please ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.');
      }
    }
  }
}
