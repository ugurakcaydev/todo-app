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
    const { title, isPinned, endDate } = await req.json();
    if (!title)
      return NextResponse.json({ error: "Başlık gerekli" }, { status: 400 });

    // endDate yoksa, bugünden 1 gün sonrası olarak ayarla
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 1);

    const newTodo = await prisma.todo.create({
      data: {
        title,
        completed: false,
        isPinned: isPinned ?? false, // Varsayılan olarak false
        endDate: endDate ? new Date(endDate) : defaultEndDate, // Varsayılan olarak yarın
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Todo eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Todo'yu güncelle (title, completed, isPinned, endDate)
export async function PATCH(req) {
  try {
    const { id, title, completed, isPinned, endDate } = await req.json();

    // ID yoksa veya güncellenecek veri yoksa hata döndür
    if (
      !id ||
      (completed === undefined && !title && isPinned === undefined && !endDate)
    ) {
      return NextResponse.json(
        { error: "ID ve en az bir güncelleme alanı gerekli" },
        { status: 400 }
      );
    }

    // Güncelleme işlemi
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title || undefined,
        completed: completed !== undefined ? completed : undefined,
        isPinned: isPinned !== undefined ? isPinned : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
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
