import { NextRequest, NextResponse } from "next/server";
import { ChatRequest } from "@/types/chat";
import { sleep } from "@/lib/utils";
export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as ChatRequest;
  console.log(message);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < message.length; i++) {
        await sleep(100);
        controller.enqueue(encoder.encode(message[i]));
      }
      controller.close();
    },
  });

  return new Response(stream);
}
