import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, targetUrl, name } = body;

    const updated = await prisma.routerQr.update({
      where: { id },
      data: { slug, targetUrl, name },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 });
    }
    return NextResponse.json({ error: "Güncellenirken hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await prisma.routerQr.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Silinirken hata oluştu" }, { status: 500 });
  }
}
