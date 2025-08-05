import { generateConnectToken } from '../lib/stream.js';


export async function getConnectToken(req, res) {
  try {
    const token = generateConnectToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}