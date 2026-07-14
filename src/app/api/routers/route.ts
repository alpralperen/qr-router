import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const routers = await prisma.routerQr.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(routers);
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınırken hata oluştu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, targetUrl, name } = body;

    if (!slug || !targetUrl) {
      return NextResponse.json({ error: "Slug ve targetUrl zorunludur" }, { status: 400 });
    }

    const newRouter = await prisma.routerQr.create({
      data: { slug, targetUrl, name },
    });

    return NextResponse.json(newRouter, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Bu slug (URL eki) zaten kullanılıyor" }, { status: 400 });
    }
    return NextResponse.json({ error: "Oluşturulurken hata oluştu" }, { status: 500 });
  }
}
