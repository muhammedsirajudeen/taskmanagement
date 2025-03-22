import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import connectDB from '@/config/mongo.config'

const app = express()
configDotenv()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders:['Content-Type','Authorization']
}))

connectDB()
app.get('/', (req, res) => {

    res.send('Hello World')
}
)
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000')
})