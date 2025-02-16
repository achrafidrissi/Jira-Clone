import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Client, Messaging } from "node-appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import dotenv from 'dotenv';

// Validation schema for email request
const emailSchema = z.object({
  productOwnerEmail: z.string().email(),
  topic: z.string().min(1),
  message: z.string().min(1)
});

const app = new Hono();
dotenv.config();

app.post(
  "/",
  sessionMiddleware,
  zValidator("json", emailSchema),
  async (c) => {
    try {
      const { productOwnerEmail, topic, message } = c.req.valid("json");
      const user = c.get("user");

      // Create Appwrite client
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
        .setKey(process.env.APPWRITE_API_KEY || '');

      const messaging = new Messaging(client);

      // Send email using Appwrite
      const response = await messaging.createEmail(
        crypto.randomUUID(),
        `Project Communication: ${topic}`,
        message,
        [], // topics
        [], // users
        [productOwnerEmail], // targets
        [], // cc
        [], // bcc
        [], // attachments
        false, // draft
        false, // html
        '' // scheduledAt
      );

      // Set CORS headers
      c.header('Access-Control-Allow-Origin', '*');
      c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return c.json({
        data: {
          messageId: response.$id,
          status: "sent"
        }
      });
    } catch (error: any) {
      console.error("Email sending error:", error);

      if (error.code === 401) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (error.code === 429) {
        return c.json({ error: "Too many requests" }, 429);
      }

      return c.json(
        { error: error.message || "Failed to send email" },
        500
      );
    }
  }
);

app.get("/", async (c) => {
    return c.json({ message: "API is working!" });
  });

export default app;
