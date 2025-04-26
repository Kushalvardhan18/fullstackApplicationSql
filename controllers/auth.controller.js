import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password || !phone) {
        console.log("Data is missing");
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    try {
        const existingUser = await prisma.userSchema.findUnique({
            where: { email }
        })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        // hash the pass
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = await crypto.randomBytes(32).toString("hex")

        const user = await prisma.userSchema.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                verificationToken
            }
        })
        if (!user) {
            return res.status(400).json({
                message: "User not registered"
            })
        }



        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            },
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Verify your email ", // Subject line
            text: `Please click on the following link 
            ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}
            `
        }
        await transporter.sendMail(mailOption)


        res.status(200).json({
            success: true,
            message: "User is registered successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Registration Failed"
        })
    }

}
export const logInUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    try {
        const user = await prisma.userSchema.findUnique({
            where: { email }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        )
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie('token', token,cookieOptions)
        return res.status(201).json({
            success: true,
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email
            },
            message: "User LoggedIn"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "LogIn Failed"
        })
    }
}