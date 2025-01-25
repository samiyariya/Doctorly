import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js' 
import stripePackage from 'stripe'; 


// app config
const app = express()
const port = process.env.PORT || 4000
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); 


connectDB()
connectCloudinary()

// middlewares
app.use(express.json())   // request wil get passed through this method
app.use(cors())           // connect frontend to backend


// api endpoint
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)


// Route to create payment intent
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Amount in cents (e.g., $10 = 1000 cents)
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency: 'usd', // Change currency if needed
            automatic_payment_methods: { enabled: true },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret, // Return client secret
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


app.get('/',(req, res)=>{
    res.send('API WORKING CORRECTLY!!!!')
})

app.listen(port, () => console.log("Server is running on port", port))
