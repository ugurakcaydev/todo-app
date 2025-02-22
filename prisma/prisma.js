import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware: endDate otomatik olarak bugünden 1 gün sonrası olacak
prisma.$extends({
  query: {
    todo: {
      async create({ args, query }) {
        if (!args.data.endDate) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          args.data.endDate = tomorrow;
        }
        return query(args);
      },
    },
  },
});

export default prisma;
