import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.CONNECT_API_KEY;
const apiSecret = process.env.CONNECT_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("CONNECT_API_KEY and CONNECT_API_SECRET must be set in the environment variables.");
}

const connectClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertConnectUser = async (userData) => {
    try {
        await connectClient.upsertUsers([userData])
        return userData;
            
    } catch (error) {
        console.error("Error upserting Connect user:", error);
        
    }

};


export const generateConnectToken = (userId) => {
    try {
        const userIdConn = userId.toString();
        return connectClient.createToken(userIdConn);
    } catch (error) {
        console.error("Error generating Connect token:", error);       
    }
}