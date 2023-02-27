import { unstable_getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth/config";
import { Providers } from "./(root)/Providers";

// import "./global.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);

  return (
    <html lang="en">
      <head />
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
