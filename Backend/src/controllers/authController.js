import { upsertConnectUser } from '../lib/stream.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';


export async function signup(req, res) {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;


        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        });

        ////////////////////////////
        try {
            await upsertConnectUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream User created for ${newUser.fullName}`);

        } catch (error) {
            console.log("Error upserting user in Connect:", error);
        }



        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite: 'strict', // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production

        });

        res.status(201).json({ success: true, user: newUser })

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




export async function login(req, res) {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required ' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite: 'strict', // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production

        });

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}


export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ 
                message: 'All fields are required',
                missingFields: [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location',
                ].filter(Boolean)
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
               ...req.body,
                isOnboarded: true
            },
            { new: true }
        );
        if (!updatedUser)  return res.status(404).json({ message: 'User not found' });

        try {
            await upsertConnectUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream User updated after onboarding for ${updatedUser.fullName}`);

        } catch (connectError) {
            console.log("Error updating stream user during onboarding:", connectError.message);
        }

        res.status(200).json({ success : true, user: updatedUser });
    } catch (error) {
        console.error('Error during onboarding:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}