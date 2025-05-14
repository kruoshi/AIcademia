import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "Extract and list relevant keywords for the project in CSV format only. No intro or extra text.",
        },
        {
          role: "user",
          content,
        },
      ],
    }),
  });

  const data = await response.json();
  const keywords = data.choices?.[0]?.message?.content || "keyword1, keyword2";
  return new NextResponse(keywords);
}
