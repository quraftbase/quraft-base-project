// lib/pdfGenerator.ts
import jsPDF from "jspdf";
import { format } from "date-fns";
import NotoSansJP from "./fonts/NotoSansJP";

export const generatePdf = async (documentId: string, docType: "estimate" | "invoice") => {
  const res = await fetch(`/api/documents/${documentId}`);
  if (!res.ok) {
    alert("PDFデータの取得に失敗しました");
    return;
  }

  const { document, items, company } = await res.json();
  const doc = new jsPDF({ unit: "mm", format: "A4" });

  doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP);
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP");
  doc.setFontSize(9);

  // セル幅
  const colWidth = 6;
  const rowHeight = 5;
  const baseX = 10;
  const baseY = 15;

  const px = (col: number) => baseX + col * colWidth;
  const py = (row: number) => baseY + row * rowHeight;

  const cell = (
    text = "",
    x: number,
    y: number,
    w: number,
    h: number,
    options: {
      align?: "left" | "center" | "right";
      border?: boolean;
      fill?: [number, number, number];
      fontSize?: number;
    } = {}
  ) => {
    if (options.fill) {
      doc.setFillColor(...options.fill);
      doc.rect(x, y, w, h, "F");
    }
    if (options.border) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(x, y, w, h);
    }
    if (text !== "") {
      const align = options.align || "left";
      const offsetX = align === "center" ? w / 2 : align === "right" ? w - 2 : 2;
      const offsetY = h / 2 + 2.5;
      doc.setFontSize(options.fontSize || 9);
      doc.text(String(text), x + offsetX, y + offsetY, { align });
    }
  };

  // 小計・税
  const total = items.reduce((sum: number, item: any) => sum + (item.subtotal ?? 0), 0);
  const tax10base = items.filter((item: any) => item.unit !== "※").reduce((sum: number, item: any) => sum + (item.subtotal ?? 0), 0);
  const tax8base = total - tax10base;
  const tax10 = Math.round(tax10base * 0.1);
  const tax8 = Math.round(tax8base * 0.08);
  const grandTotal = total + tax10 + tax8;

  // 日付・番号
  cell(format(new Date(document.doc_date), "yyyy年MM月dd日"), px(27), py(2), colWidth * 6, rowHeight);
  cell(docType === "estimate" ? "見積番号：" : "請求番号：", px(23), py(3), colWidth * 4, rowHeight, { align: "right" });
  cell(document.doc_number, px(27), py(3), colWidth * 6, rowHeight);

  // タイトル
  cell(docType === "estimate" ? "見積書" : "請求書", px(1), py(5), colWidth * 31, rowHeight * 2, {
    align: "center",
    fontSize: 20,
  });

  // 顧客名・文言
  cell(document.customer_name, px(1), py(8), colWidth * 12, rowHeight, { fontSize: 14 });
  doc.setLineWidth(0.5);
  doc.line(px(1), py(9), px(13), py(9));
  cell("様", px(13), py(8), colWidth * 2, rowHeight, { align: "center" });
  if (docType === "estimate") cell("下記の通り、お見積り申し上げます。", px(1), py(9), colWidth * 31, rowHeight);

  // 金額欄
  cell("御請求金額（税込み）", px(1), py(11), colWidth * 14, rowHeight, { align: "center", border: true, fill: [191, 191, 191] });
  cell(`\u00a5${grandTotal.toLocaleString()}`, px(1), py(12), colWidth * 13, rowHeight * 2, { align: "center", fontSize: 16, border: false });
  // 手動で上下左の線だけ引く（右側なし）
  doc.line(px(1), py(12), px(1), py(12 + 2)); // 左線
  doc.line(px(1), py(12), px(14), py(12));    // 上線
  doc.line(px(1), py(12 + 2), px(14), py(12 + 2)); // 下線
  cell("円", px(14), py(12), colWidth * 1, rowHeight * 2, { align: "center", fontSize: 16, border: false });
  // 手動で上下右の線だけ引く（左側なし）
  doc.line(px(15), py(12), px(15), py(12 + 2)); // 右線
  doc.line(px(14), py(12), px(15), py(12));    // 上線
  doc.line(px(14), py(12 + 2), px(15), py(12 + 2)); // 下線

  if (docType === "invoice") {
    cell("お支払い期限", px(1), py(14), colWidth, rowHeight);
    cell(format(new Date(document.due_date), "yyyy年MM月dd日"), px(6), py(14), colWidth, rowHeight);
  }

  // 会社情報
  cell(company.company_name, px(20), py(10), colWidth, rowHeight, {fontSize: 12});
  cell("登録番号：", px(20), py(11), colWidth * 2, rowHeight);
  cell(company.registration_number, px(23), py(11), colWidth * 6, rowHeight);
  cell("〒", px(20), py(13), colWidth, rowHeight);
  cell(company.postal_code, px(21), py(13), colWidth * 2, rowHeight);
  cell(company.address, px(20), py(14), colWidth * 12, rowHeight);
  cell("TEL：", px(20), py(16), colWidth * 2, rowHeight);
  cell(company.phone, px(22), py(16), colWidth * 6, rowHeight);

  // 条件（見積書）
  if (docType === "estimate") {
    cell("納期", px(1), py(16), colWidth * 2, rowHeight);
    cell(document.due_date, px(6), py(16), colWidth * 9, rowHeight);
    cell("支払条件", px(1), py(17), colWidth * 2, rowHeight);
    cell(document.payment_terms, px(6), py(17), colWidth * 9, rowHeight);
    cell("有効期限", px(1), py(18), colWidth * 2, rowHeight);
    cell(document.valid_until, px(6), py(18), colWidth * 9, rowHeight);
  }

  // 条件（請求書）
  if (docType === "invoice") {
    cell("平素より格別のご愛顧を賜わり、誠にありがとうございます。", px(1), py(16), colWidth * 31, rowHeight);
    cell("上記の通りご請求させていただきますので宜しくお願い致します。", px(1), py(17), colWidth * 31, rowHeight);
    cell("ご査収の上、お支払日までに振込先までお振込みください。", px(1), py(18), colWidth * 31, rowHeight);
    cell("振込先：", px(20), py(18), colWidth * 2, rowHeight);
    cell(company.bank, px(20), py(19), colWidth * 2, rowHeight);
    cell("口座名義　", px(20), py(20), colWidth * 2, rowHeight);
    cell(company.account_name, px(23), py(20), colWidth * 2, rowHeight);
    cell("※誠に申し訳ございませんが振込手数料については", px(20), py(21), colWidth * 2, rowHeight);
    cell("　ご負担くださいますようお願い申し上げます。", px(20), py(22), colWidth * 2, rowHeight);
  }

  // 明細ヘッダー
  const tableY = py(24);
  const head = ["品名", "数量", "単位", "単価", "金額"];
  const widths = [colWidth * 19, colWidth * 2, colWidth * 2, colWidth * 4, colWidth * 4];
  let x = px(1);
  head.forEach((label, i) => {
    cell(label, x, tableY, widths[i], rowHeight, { align: "center", border: true, fill: [191, 191, 191] });
    x += widths[i];
  });

  // 明細行（最大15）
  for (let i = 0; i < 15; i++) {
    const item = items[i];
    const y = tableY + rowHeight * (i + 1);
    const values = item ? [item.item_name, item.quantity, item.unit, item.unit_price, item.subtotal] : ["", "", "", "", ""];
    let x = px(1);
    values.forEach((v, j) => {
      cell(String(v ?? ""), x, y, widths[j], rowHeight, { align: j >= 1 ? "right" : "left", border: true });
      x += widths[j];
    });
  }

  // 小計・税
  const sy = py(40);
  cell("※は軽減税率対象です。", px(1), sy, colWidth * 19, rowHeight);
  cell("小計", px(20), sy, colWidth * 8, rowHeight, { border: true });
  cell(`\u00a5${total.toLocaleString()}`, px(28), sy, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("消費税", px(20), sy + rowHeight, colWidth * 8, rowHeight, { border: true });
  cell(`\u00a5${(tax10 + tax8).toLocaleString()}`, px(28), sy + rowHeight, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("合計", px(20), sy + rowHeight * 2, colWidth * 8, rowHeight, { border: true });
  cell(`\u00a5${grandTotal.toLocaleString()}`, px(28), sy + rowHeight * 2, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("10%対象", px(17), sy + rowHeight * 4, colWidth * 3, rowHeight, { border: true });
  cell(`\u00a5${tax10base.toLocaleString()}`, px(20), sy + rowHeight * 4, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("消費税", px(24), sy + rowHeight * 4, colWidth * 4, rowHeight, { border: true });
  cell(`\u00a5${tax10.toLocaleString()}`, px(28), sy + rowHeight * 4, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("軽減8%対象", px(17), sy + rowHeight * 5, colWidth * 3, rowHeight, { border: true });
  cell(`\u00a5${tax8base.toLocaleString()}`, px(20), sy + rowHeight * 5, colWidth * 4, rowHeight, { align: "right", border: true });
  cell("消費税", px(24), sy + rowHeight * 5, colWidth * 4, rowHeight, { border: true });
  cell(`\u00a5${tax8.toLocaleString()}`, px(28), sy + rowHeight * 5, colWidth * 4, rowHeight, { align: "right", border: true });

  // 備考欄
  cell("備考欄", px(1), py(47), colWidth * 3, rowHeight);
  cell(document.remarks ?? "", px(1), py(48), colWidth * 31, rowHeight * 2, { border: true });

  doc.save(`${docType === "estimate" ? "見積書" : "請求書"}_${document.customer_name}_${format(new Date(document.doc_date), "yyyyMMdd")}.pdf`);
};
