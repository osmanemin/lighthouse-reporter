import startReport from "./src/startReport.js"
import dotenv from "dotenv";

dotenv.config();

startReport(process.env.URL, process.env.REPEAT_COUNT);