import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/purchase-orders", label: "Purchase Orders" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-6 font-bold text-lg">
        PO System
      </div>

      <nav className="space-y-1 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}