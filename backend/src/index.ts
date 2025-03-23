import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import connectDB from '@/config/mongo.config'
import UserRouter from './route/user.routes'
import TaskRouter from './route/task.routes'
import cookieparser from "cookie-parser"
import { IUser } from './model/user.model'
const app = express()
configDotenv()
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieparser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}))

connectDB()

app.use('/api/task', TaskRouter)
app.use('/api/user', UserRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})