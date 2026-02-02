import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Create reusable transporter with connection pooling
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Optimizations for serverless - increased timeouts for Namecheap
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    // TLS options for compatibility
    tls: {
      rejectUnauthorized: false,
    },
  });
}

interface EmailRecipient {
  id: string;
  email: string;
  full_name: string | null;
}

// Maximum recipients per request to avoid timeout
const MAX_RECIPIENTS_PER_REQUEST = 20;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { recipients, subject, htmlContent } = body as {
      recipients: EmailRecipient[];
      subject: string;
      htmlContent: string;
    };

    // Validate inputs
    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: "No recipients selected" }, { status: 400 });
    }

    if (!subject || subject.trim() === "") {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    if (!htmlContent || htmlContent.trim() === "") {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 });
    }

    // Limit recipients to avoid Vercel timeout
    if (recipients.length > MAX_RECIPIENTS_PER_REQUEST) {
      return NextResponse.json({
        error: `Vui lòng chọn tối đa ${MAX_RECIPIENTS_PER_REQUEST} người nhận mỗi lần gửi để tránh timeout.`
      }, { status: 400 });
    }

    // Validate SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        error: "SMTP configuration is missing. Please check environment variables."
      }, { status: 500 });
    }

    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || "hotro@taophim.com";
    const fromName = process.env.SMTP_FROM_NAME || "Taophim";

    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: [],
    };

    // Send emails concurrently with Promise.allSettled for better performance
    const emailPromises = recipients
      .filter(recipient => recipient.email)
      .map(async (recipient) => {
        // Personalize content
        const personalizedHtml = htmlContent
          .replace(/\{\{name\}\}/g, recipient.full_name || "Quý khách")
          .replace(/\{\{email\}\}/g, recipient.email);

        const personalizedSubject = subject
          .replace(/\{\{name\}\}/g, recipient.full_name || "Quý khách")
          .replace(/\{\{email\}\}/g, recipient.email);

        await transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: recipient.email,
          subject: personalizedSubject,
          html: personalizedHtml,
        });

        return recipient.email;
      });

    const emailResults = await Promise.allSettled(emailPromises);

    emailResults.forEach((result, index) => {
      const email = recipients[index]?.email;
      if (!email) return;

      if (result.status === "fulfilled") {
        results.success.push(email);
      } else {
        console.error(`Failed to send email to ${email}:`, result.reason);
        results.failed.push(email);
      }
    });

    // Close the pool
    transporter.close();

    return NextResponse.json({
      message: `Sent ${results.success.length} emails successfully`,
      success: results.success,
      failed: results.failed,
    });

  } catch (error: unknown) {
    console.error("Marketing Email Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
