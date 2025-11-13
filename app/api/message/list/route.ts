import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
  const chatId = request.nextUrl.searchParams.get("chatId");

  if(!chatId){
    return NextResponse.json({
      code: -1,
      message: "chatId is required",
    });
  }
  const list = await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  
  return NextResponse.json({ code: 0, data: list });
}
