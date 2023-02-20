import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex space-x-4 bg-blue-600 text-white">
        <Link className="px-4 py-2" href="/">
          Home
        </Link>
        <Link className="px-4 py-2" href="/admin/entries">
          Entries
        </Link>
        <Link className="px-4 py-2" href="/admin/upload">
          Upload
        </Link>
      </nav>

      {children}
    </div>
  );
}
