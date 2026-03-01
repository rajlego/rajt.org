import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (session?.user?.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { requestId } = await request.json();
  if (!requestId) {
    return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
  }

  const docRef = db.collection("access_requests").doc(requestId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  await docRef.update({
    status: "rejected",
    reviewedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
