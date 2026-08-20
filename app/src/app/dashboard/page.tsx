"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, KpiCard } from "@/components/ui/Card";
import { mockWarehouseStock, mockWeeklyTrend } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  const totalStok = mockWarehouseStock.reduce((a, b) => a + b.stok, 0);
  const totalInbound = mockWarehouseStock.reduce((a, b) => a + b.inbound, 0);
  const totalOutbound = mockWarehouseStock.reduce((a, b) => a + b.outbound, 0);

  const kpi = useMemo(() => {
    if (!selectedWarehouse) {
      return { stok: totalStok, inbound: totalInbound, outbound: totalOutbound };
    }
    const g = mockWarehouseStock.find((w) => w.gudang === selectedWarehouse);
    return { stok: g?.stok ?? 0, inbound: g?.inbound ?? 0, outbound: g?.outbound ?? 0 };
  }, [selectedWarehouse, totalStok, totalInbound, totalOutbound]);

  const chartData = useMemo(() => {
    const rows = selectedWarehouse
      ? mockWeeklyTrend.filter((r) => r.gudang === selectedWarehouse)
      : mockWeeklyTrend;

    const byHari = new Map<string, { hari: string; masuk: number; keluar: number }>();
    for (const r of rows) {
      const acc = byHari.get(r.hari) ?? { hari: r.hari, masuk: 0, keluar: 0 };
      acc.masuk += r.masuk;
      acc.keluar += r.keluar;
      byHari.set(r.hari, acc);
    }
    const order = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    return order.map((hari) => byHari.get(hari) ?? { hari, masuk: 0, keluar: 0 });
  }, [selectedWarehouse]);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 px-6 py-10 text-neutral-900 dark:text-neutral-100 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-3"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Warehouse Visibility — Demo
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            Stok tiga gudang di satu layar.
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Data di bawah ini adalah data contoh (mock) untuk demo PoC — begitu
            terhubung ke WMS asli, layout ini langsung diisi data real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <KpiCard
            label="Total Stok (unit)"
            value={kpi.stok.toLocaleString("id-ID")}
            delta="+3.2% minggu ini"
          />
          <KpiCard
            label="Barang Masuk (minggu ini)"
            value={kpi.inbound.toLocaleString("id-ID")}
            delta="+8%"
          />
          <KpiCard
            label="Barang Keluar (minggu ini)"
            value={kpi.outbound.toLocaleString("id-ID")}
            delta="-2%"
            deltaPositive={false}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Barang Masuk vs Keluar — 7 Hari Terakhir
                {selectedWarehouse && (
                  <span className="ml-2 text-neutral-500">· {selectedWarehouse}</span>
                )}
              </p>
              {selectedWarehouse && (
                <button
                  onClick={() => setSelectedWarehouse(null)}
                  className="rounded-full border border-neutral-300 dark:border-neutral-700 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Lihat Semua Gudang
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedWarehouse ?? "all"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" vertical={false} />
                    <XAxis dataKey="hari" stroke="#8a8a8a" fontSize={12} />
                    <YAxis stroke="#8a8a8a" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--tooltip-bg)",
                        color: "var(--tooltip-fg)",
                        border: "1px solid var(--tooltip-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="masuk" fill="#c00000" radius={[4, 4, 0, 0]} name="Masuk" />
                    <Bar dataKey="keluar" fill="#5a2020" radius={[4, 4, 0, 0]} name="Keluar" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </Card>

          <Card>
            <p className="mb-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">Per Gudang</p>
            <div className="space-y-4">
              {mockWarehouseStock.map((g) => {
                const active = g.gudang === selectedWarehouse;
                return (
                  <button
                    key={g.gudang}
                    onClick={() => setSelectedWarehouse(active ? null : g.gudang)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-red-600 bg-red-50 dark:bg-red-950/40"
                        : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    )}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className={active ? "text-red-700 dark:text-red-200" : "text-neutral-700 dark:text-neutral-300"}>
                        {g.gudang}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {g.stok.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-1.5 rounded-full bg-red-600"
                        style={{ width: `${(g.stok / totalStok) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
