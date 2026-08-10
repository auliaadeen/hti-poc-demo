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

export const mockWeeklyTrend = [
  { hari: "Sen", masuk: 210, keluar: 180 },
  { hari: "Sel", masuk: 260, keluar: 190 },
  { hari: "Rab", masuk: 190, keluar: 220 },
  { hari: "Kam", masuk: 300, keluar: 250 },
  { hari: "Jum", masuk: 240, keluar: 210 },
  { hari: "Sab", masuk: 120, keluar: 100 },
  { hari: "Min", masuk: 60, keluar: 50 },
];
