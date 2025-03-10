// const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// const ENDPOINT = process.env.MAILTRAP_ENDPOINT;
const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({
    token: TOKEN,
});

export const mailtrapClient = new MailtrapClient({
    endpoint: process.env.MAILTRAP_ENDPOINT,
    token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
    email: "mailtrap@demomailtrap.co",
    name: "Mailtrap",
};

// const recipients = [
//     { email: "ratchakijs@gmail.com", }
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);