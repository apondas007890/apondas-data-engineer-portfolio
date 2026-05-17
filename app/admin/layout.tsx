import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio Admin | Apon Kumar Das",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
