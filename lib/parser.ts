import prisma from "~/prisma";

export const parseRow = async (row: Record<string, string>) => {
  const data = {
    code: row["SIFRA_ROBE"].toLocaleLowerCase("hr"),
    name: row["NAZIV_ROBE_USLUGE"],
    quantity: Number(row["RAZLIKA"]),

    priceHrk: Math.round(Number(row["PRODAJA3"]) * 100),
    priceEur: Math.round((Number(row["PRODAJA3"]) * 100) / 7.5345),
  };

  return await prisma.product.upsert({
    where: {
      code: row["SIFRA_ROBE"],
    },
    create: data,
    update: data,
  });
};
