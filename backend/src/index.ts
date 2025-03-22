import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import connectDB from '@/config/mongo.config'
import UserRouter from './route/user.routes'
import TaskRouter from './route/task.routes'

const app = express()
configDotenv()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))

connectDB()

app.use('/api/task', TaskRouter)
app.use('/api/user', UserRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000')
})