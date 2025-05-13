import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: file.type });

  const uploadForm = new FormData();
  uploadForm.append("pdf", blob, file.name);

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: uploadForm,
  });

  const text = await res.text();
  return new NextResponse(text);
}
