import { NextRequest, NextResponse } from "next/server";
import { ChatRequest } from "@/types/chat";
import { sleep } from "@/lib/utils";
export async function POST(request: NextRequest) {
  const { messages, model } = (await request.json()) as ChatRequest;
  console.log(messages, model);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const messageText = messages[messages.length - 1].content
      for (let i = 0; i < messageText.length; i++) {
          await sleep(100)
          controller.enqueue(encoder.encode(messageText[i]))
      }
      controller.close()
  }
  });

  return new Response(stream);
}
