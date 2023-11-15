import express from 'express'
import usersRoutes from './routes/users.js'
import availabilityRoutes from './routes/availability.js'
import meetingRoutes from './routes/meeting.js'
import timeSlotRoute from './routes/timeslots.js'
import authRoutes from './routes/auth.js'
// import extraRoutes from './routes/extra.js'

const app = express()
const PORT = 5000

//Endpoints
app.use(express.json())
app.use('/api/users', usersRoutes)
app.use('/api/user', availabilityRoutes)
app.use('/api/meeting', meetingRoutes)
app.use('/api/timeslots', timeSlotRoute)
app.use('/api/auth', authRoutes)
// app.use('/api/extra', extraRoutes)

app.get('/hello', (req, res) => {
    res.send('Hello World!')
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
