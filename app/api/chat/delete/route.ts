import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id } = body;
  console.log("===delete==", id);
  if (!id) {
    return NextResponse.json({
      code: 1,
      message: "id is required",
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.message.deleteMany({
      where: { chatId: id },
    });
    await tx.chat.delete({
      where: { id },
    });
  });

  return NextResponse.json({
    code: 0,
    data: { message: "success" },
  });
}
