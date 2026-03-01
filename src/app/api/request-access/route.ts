import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { sendAccessRequestNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, turnstileToken } = body;

    if (!email || !turnstileToken) {
      return NextResponse.json(
        { error: "Email and captcha are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );
    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // Check for existing request
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db
      .collection("access_requests")
      .where("email", "==", normalizedEmail)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0].data();
      if (doc.status === "approved") {
        return NextResponse.json({
          message: "You're already approved! Please log in.",
          status: "approved",
        });
      }
      if (doc.status === "pending") {
        return NextResponse.json({
          message: "Your request is already pending. You'll hear back soon.",
          status: "pending",
        });
      }
      // If rejected, allow re-request by updating the existing doc
      await db.collection("access_requests").doc(existing.docs[0].id).update({
        status: "pending",
        name: name?.trim() || null,
        requestedAt: new Date().toISOString(),
        reviewedAt: null,
      });
    } else {
      // Create new request
      await db.collection("access_requests").add({
        email: normalizedEmail,
        name: name?.trim() || null,
        status: "pending",
        requestedAt: new Date().toISOString(),
        reviewedAt: null,
      });
    }

    // Notify admin
    try {
      await sendAccessRequestNotification(normalizedEmail, name?.trim());
    } catch (emailErr) {
      // Don't fail the request if email notification fails
      console.error("Failed to send notification email:", emailErr);
    }

    return NextResponse.json({
      message: "Request submitted! You'll be notified when approved.",
      status: "submitted",
    });
  } catch (err) {
    console.error("Access request error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
