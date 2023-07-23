import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"

import KPI from "./models/KPI.js"
import { kpis } from "./data/data.js"

import kpiRoutes from "./routes/kpi.js"

// configuration
dotenv.config()
const app = express()

app.use(helmet())
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
)
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(cors())

const PORT = process.env.PORT || 9000

// mongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`server port:${PORT}`))

    await mongoose.connection.db.dropDatabase()
    KPI.insertMany(kpis)
  })
  .catch((err) => console.error(`${err} not connect`))

// routes
app.use("/kpis", kpiRoutes)
