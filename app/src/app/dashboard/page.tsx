"use client";

import { motion } from "framer-motion";
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
import Link from "next/link";

export default function DashboardPage() {
  const totalStok = mockWarehouseStock.reduce((a, b) => a + b.stok, 0);
  const totalInbound = mockWarehouseStock.reduce((a, b) => a + b.inbound, 0);
  const totalOutbound = mockWarehouseStock.reduce((a, b) => a + b.outbound, 0);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
          &larr; Kembali
        </Link>
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
          <p className="mt-2 max-w-2xl text-neutral-400">
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
          <KpiCard label="Total Stok (unit)" value={totalStok.toLocaleString("id-ID")} delta="+3.2% minggu ini" />
          <KpiCard label="Barang Masuk (minggu ini)" value={totalInbound.toLocaleString("id-ID")} delta="+8%" />
          <KpiCard label="Barang Keluar (minggu ini)" value={totalOutbound.toLocaleString("id-ID")} delta="-2%" deltaPositive={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <Card className="lg:col-span-2">
            <p className="mb-4 text-sm font-medium text-neutral-300">
              Barang Masuk vs Keluar — 7 Hari Terakhir
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockWeeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="hari" stroke="#8a8a8a" fontSize={12} />
                <YAxis stroke="#8a8a8a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="masuk" fill="#c00000" radius={[4, 4, 0, 0]} name="Masuk" />
                <Bar dataKey="keluar" fill="#5a2020" radius={[4, 4, 0, 0]} name="Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <p className="mb-4 text-sm font-medium text-neutral-300">Per Gudang</p>
            <div className="space-y-4">
              {mockWarehouseStock.map((g) => (
                <div key={g.gudang}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-300">{g.gudang}</span>
                    <span className="font-medium text-white">
                      {g.stok.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-800">
                    <div
                      className="h-1.5 rounded-full bg-red-600"
                      style={{ width: `${(g.stok / totalStok) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
