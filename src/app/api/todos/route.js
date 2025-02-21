import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

// ✅ GET: Tüm Todo'ları getir
export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Todo'lar alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

// ✅ POST: Yeni bir Todo ekle
export async function POST(req) {
  try {
    const { title } = await req.json();
    if (!title)
      return NextResponse.json({ error: "Başlık gerekli" }, { status: 400 });

    const newTodo = await prisma.todo.create({
      data: { title, completed: false },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Todo eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Todo'nun tamamlanma durumunu güncelle//
export async function PATCH(req, { params }) {
  try {
    const { id, title, completed } = await req.json();
    console.log(id, title, completed, "aaa");
    // ID yoksa veya güncellenecek veri yoksa hata döndür
    if (!id || (completed === undefined && !title)) {
      return NextResponse.json(
        { error: "ID ve başlık veya tamamlanma durumu gerekli" },
        { status: 400 }
      );
    }

    // Güncelleme işlemi
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title || undefined,
        completed: completed !== undefined ? completed : undefined,
      },
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("Todo güncellenirken hata oluştu:", error);
    return NextResponse.json(
      { error: "Todo güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Belirtilen ID'deki Todo'yu sil
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const deleteAll = searchParams.get("all");

    if (deleteAll === "true") {
      await prisma.todo.deleteMany();
      return NextResponse.json(
        { message: "Tüm todolar silindi" },
        { status: 200 }
      );
    }

    // Tek bir Todo silme işlemi
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ message: "Todo silindi" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Todo silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
