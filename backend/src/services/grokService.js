import { Groq } from "groq-sdk";
import ApiError from "../utils/ApiError.js";

if (!process.env.GROQ_API_KEY) {
  throw new ApiError(500, "GROQ_API_KEY not set");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default groq;
