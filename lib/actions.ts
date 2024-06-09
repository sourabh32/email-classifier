"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { google } from "googleapis"

import { OpenAI } from 'openai';
import { Email } from "./types";



async function main() {
  
}

export const getEmails = async (number:string) => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    console.error("No session found");
    return { error: "No session found" };
  }

  const accessToken = session.accessToken;
  const refreshToken = session.refreshToken;

  if (!accessToken || !refreshToken) {
    console.error("Access token or refresh token missing");
    return { error: "Access token or refresh token missing" };
  }

  const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_KEY || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY || "",
    redirectUri: process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback/google",
  });

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: parseInt(number),
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return { emails: [] };
    }

    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        try {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });
          return msg.data;
        } catch (err) {
          console.error(`Error fetching email with ID ${message.id}:`, err);
          return null;
        }
      })
    );

    const validEmailDetails = emailDetails.filter(email => email !== null);

    const finalOutput = validEmailDetails.map((email) => {
      const headers = email.payload.headers.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
      }, {});

      const bodyPart = email?.payload?.parts?.find((part) => part.mimeType === 'text/html') || email?.payload?.body;

      const emailBody = bodyPart?.body?.data ? Buffer.from(bodyPart.body.data, 'base64').toString('utf-8') : '';

      return { from: headers.From, subject: headers.Subject, date: headers.Date, emailBody };
    });

    return finalOutput;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return { error: "Failed to fetch emails" };
  }
};



export const classifyMail = async (emails:string[],apiKey:string) => {
  
const openai = new OpenAI({
  apiKey
});
const prompt = `
You are given an array of email objects. Each email object contains properties like 'subject' and 'body'. Your task is to classify each email into one of the following categories: Important, Promotional, Social, Marketing, Spam. For each email object, add a new property 'classification' with the appropriate category as its value.

Here are the email objects:

${JSON.stringify(emails, null, 2)}

Add a 'classification' property to each email object and return the updated array.
`;


  const params = {
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  };

  try {
    const chatCompletion = await openai.chat.completions.create(params);
   
    
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error classifying email:', error);
    throw new Error('Failed to classify email');
  }
};
