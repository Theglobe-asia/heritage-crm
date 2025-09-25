"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, BarChart3 } from "lucide-react";

const items = [
  {
    href: "/crm/contacts",
    title: "Contacts",
    desc: "Import and manage",
    icon: Users,
  },
  {
    href: "/crm/campaigns",
    title: "Campaigns",
    desc: "Create and send",
    icon: Mail,
  },
  {
    href: "/crm/reports",
    title: "Reports",
    desc: "Opens and clicks",
    icon: BarChart3,
  },
];

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-12 text-center">
        CRM · {process.env.NEXT_PUBLIC_BRAND_NAME}
      </h1>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href={item.href}>
                <Card className="cursor-pointer hover:shadow-xl transition-all h-full">
                  <CardContent className="flex flex-col items-center justify-center text-center p-10">
                    <Icon className="h-12 w-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
