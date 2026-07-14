import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    const routerQr = await prisma.routerQr.findUnique({
      where: { slug },
    });

    if (!routerQr || !routerQr.targetUrl) {
      // Bulunamadıysa veya hedef yoksa ana sayfaya (veya admin sayfasına) yönlendir.
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Hedef URL'e yönlendir
    // Eğer hedef url "http" ile başlamıyorsa başına ekleyebiliriz
    let target = routerQr.targetUrl;
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }

    return NextResponse.redirect(target);
  } catch (error) {
    console.error("Yönlendirme hatası:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
