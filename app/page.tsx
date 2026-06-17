// src/app/page.tsx

import Link from "next/link";
import {
  Package,
  Truck,
  ClipboardList,
  Boxes,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type ModuleLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const modules: ModuleLink[] = [
  {
    href: "/products",
    label: "Products",
    description: "Manage your catalog, pricing, and SKUs.",
    icon: Package,
    accent: "#5B7A6B",
  },
  {
    href: "/suppliers",
    label: "Suppliers",
    description: "Keep vendor details and contacts up to date.",
    icon: Truck,
    accent: "#B5793F",
  },
  {
    href: "/purchase-orders",
    label: "Purchase Orders",
    description: "Create, track, and approve orders end-to-end.",
    icon: ClipboardList,
    accent: "#3D5A80",
  },
  {
    href: "/stock",
    label: "Stock",
    description: "Monitor inventory levels across locations.",
    icon: Boxes,
    accent: "#8B4B4F",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6F76]">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#15171A] sm:text-4xl">
            Purchase Order System
          </h1>
          <p className="mt-2 text-base text-[#6B6F76]">
            Manage products, suppliers, orders, and stock from one place.
          </p>
        </header>

        <nav aria-label="Main sections" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modules.map(({ href, label, description, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex items-start gap-4 rounded-lg border border-[#E8E6E1] bg-white p-6 transition-colors duration-150 hover:border-[#D6D3CC] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A44] focus-visible:ring-offset-2"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${accent}1A`, color: accent }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <span className="flex-1">
                <span className="flex items-center justify-between">
                  <span className="text-base font-medium text-[#15171A]">
                    {label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-[#9A9DA1] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#15171A] motion-reduce:transition-none"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="mt-1 block text-sm text-[#6B6F76]">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}