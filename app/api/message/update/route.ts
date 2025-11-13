import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest) {
  console.log("===post==", request);
  const body = await request.json();
  const { id, ...data } = body;

  if (!data.chatId) {
    const chat = await prisma.chat.create({
      data: {
        title: "新对话",
      },
    });
    data.chatId = chat.id;
  }else{ 
    await prisma.chat.update({
      where: { id: data.chatId as string },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  const message = await prisma.message.upsert({
    where: { id },
    update: data,
    create: data,
  });

  return NextResponse.json({
    code: 0,
    data: { message },
  });
}
