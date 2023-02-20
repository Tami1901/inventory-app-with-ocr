import { getCsrfToken } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isDev } from "~/lib";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

export default async function Login() {
  const session = await unstable_getServerSession();
  if (session) {
    redirect("/");
  }

  const csrfToken =
    cookies().get("next-auth.csrf-token")?.value?.split("|")?.[0] || (await getCsrfToken());

  return (
    <div className="p-20 flex flex-col gap-4">
      <h1 className="text-xl">Login</h1>

      <form method="post" action="/api/auth/callback/credentials" className="space-y-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Input type="email" name="email" {...(isDev && { defaultValue: "foo@bar.com" })} />
        <Input type="password" name="password" {...(isDev && { defaultValue: "foobar123" })} />

        <Button type="submit">Sign in with Email</Button>
      </form>
    </div>
  );
}
