export const mockExtraction = {
  documentType: "Commercial Invoice",
  confidence: 0.96,
  fields: [
    { label: "Invoice No.", value: "INV-2026-08-0417" },
    { label: "Invoice Date", value: "05 Agustus 2026" },
    { label: "Supplier", value: "Honda Trading Corporation (Thailand)" },
    { label: "Buyer", value: "PT Honda Trading Indonesia" },
    { label: "PO Reference", value: "PO-HTI-88213" },
    { label: "Currency", value: "USD" },
    { label: "Total Amount", value: "USD 48,920.00" },
    { label: "Incoterm", value: "FOB Laem Chabang" },
    { label: "HS Code", value: "8708.99" },
    { label: "Port of Discharge", value: "Tanjung Priok" },
  ],
  lineItems: [
    { sku: "HTI-BRG-2201", desc: "Brake Caliper Assembly", qty: 480, unit: "USD 42.50", total: "USD 20,400.00" },
    { sku: "HTI-FLT-1187", desc: "Oil Filter Cartridge", qty: 2200, unit: "USD 3.10", total: "USD 6,820.00" },
    { sku: "HTI-SHK-0552", desc: "Shock Absorber Rear", qty: 350, unit: "USD 59.20", total: "USD 20,720.00" },
    { sku: "HTI-CBL-0093", desc: "Throttle Cable Set", qty: 980, unit: "USD 0.98", total: "USD 960.00" },
  ],
};

export const mockWarehouseStock = [
  { gudang: "Cikarang - Gudang A", inbound: 1240, outbound: 980, stok: 8420 },
  { gudang: "Cikarang - Gudang B (BMW)", inbound: 610, outbound: 540, stok: 3110 },
  { gudang: "Surabaya - Gudang C", inbound: 890, outbound: 760, stok: 5280 },
];

// Per-gudang breakdown so the dashboard bar chart can cross-filter by
// warehouse. Summed across gudang per hari, these roughly reproduce the
// combined weekly trend previously hardcoded here.
export const mockWeeklyTrend = [
  { hari: "Sen", gudang: "Cikarang - Gudang A", masuk: 95, keluar: 80 },
  { hari: "Sen", gudang: "Cikarang - Gudang B (BMW)", masuk: 47, keluar: 40 },
  { hari: "Sen", gudang: "Surabaya - Gudang C", masuk: 68, keluar: 60 },

  { hari: "Sel", gudang: "Cikarang - Gudang A", masuk: 118, keluar: 82 },
  { hari: "Sel", gudang: "Cikarang - Gudang B (BMW)", masuk: 58, keluar: 45 },
  { hari: "Sel", gudang: "Surabaya - Gudang C", masuk: 84, keluar: 63 },

  { hari: "Rab", gudang: "Cikarang - Gudang A", masuk: 86, keluar: 96 },
  { hari: "Rab", gudang: "Cikarang - Gudang B (BMW)", masuk: 42, keluar: 52 },
  { hari: "Rab", gudang: "Surabaya - Gudang C", masuk: 62, keluar: 72 },

  { hari: "Kam", gudang: "Cikarang - Gudang A", masuk: 136, keluar: 108 },
  { hari: "Kam", gudang: "Cikarang - Gudang B (BMW)", masuk: 67, keluar: 59 },
  { hari: "Kam", gudang: "Surabaya - Gudang C", masuk: 97, keluar: 83 },

  { hari: "Jum", gudang: "Cikarang - Gudang A", masuk: 109, keluar: 91 },
  { hari: "Jum", gudang: "Cikarang - Gudang B (BMW)", masuk: 53, keluar: 50 },
  { hari: "Jum", gudang: "Surabaya - Gudang C", masuk: 78, keluar: 69 },

  { hari: "Sab", gudang: "Cikarang - Gudang A", masuk: 54, keluar: 43 },
  { hari: "Sab", gudang: "Cikarang - Gudang B (BMW)", masuk: 27, keluar: 24 },
  { hari: "Sab", gudang: "Surabaya - Gudang C", masuk: 39, keluar: 33 },

  { hari: "Min", gudang: "Cikarang - Gudang A", masuk: 27, keluar: 22 },
  { hari: "Min", gudang: "Cikarang - Gudang B (BMW)", masuk: 13, keluar: 12 },
  { hari: "Min", gudang: "Surabaya - Gudang C", masuk: 20, keluar: 16 },
];
