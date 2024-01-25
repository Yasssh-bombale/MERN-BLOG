import express from "express";
import { config } from "dotenv";

config({
  path: ".env", //env file located in root directory
});

export const app = express();
