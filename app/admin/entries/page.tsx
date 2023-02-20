import db from "~/prisma";

export default async function EntriesPage() {
  const entries = await db.inventoryEntry.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      product: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  });

  return (
    <table>
      <thead>
        <tr>
          <th>ProductCode</th>
          <th>Quantity</th>
          <th>Person</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.backupCode ? <i>{entry.backupCode}</i> : entry.product!.code}</td>
            <td>{entry.quantity}</td>
            <td>{entry.user.name}</td>
            <td>{entry.createdAt.toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
