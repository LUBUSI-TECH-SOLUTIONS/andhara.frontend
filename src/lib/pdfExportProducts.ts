import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Product } from "@/features/products/types/productTypes" 
import { formatCurrency, formatPercent } from "./format"

export const exportToPdf = (products: Product[], title = "Productos Farmacéuticos") => {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text(title, 14, 22)

  doc.setFontSize(11)
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30)

  const columns = [
    { header: "ID", dataKey: "product_id" },
    { header: "Producto", dataKey: "product_name" },
    { header: "Proveedor", dataKey: "supplier_id" },
    { header: "Precio Compra", dataKey: "purchase_price" },
    { header: "Descuento", dataKey: "product_discount" },
    { header: "Precio Venta", dataKey: "sale_price" },
    { header: "Margen", dataKey: "profit_margin" },
    { header: "IVA", dataKey: "vat" },
  ]

  const data = products.map((product) => ({
    product_id: product.id_product,
    product_name: product.product_name,
    supplier_id: product.id_supplier,
    purchase_price: formatCurrency(product.purchase_price),
    product_discount: formatPercent(product.product_discount ?? 0),
    sale_price: formatCurrency(product.sale_price),
    profit_margin: formatPercent(product.profit_margin ?? 0),
    vat: formatPercent(product.vat ?? 0),
  }))

  autoTable(doc, {
    startY: 40,
    head: [columns.map((column) => column.header)],
    body: data.map((item) => columns.map((column) => {
      const value = item[column.dataKey as keyof typeof item];
      return value === undefined ? '' : value;
    })),
    theme: "striped", 
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  })

  doc.save("productos-farmaceuticos.pdf")
}
