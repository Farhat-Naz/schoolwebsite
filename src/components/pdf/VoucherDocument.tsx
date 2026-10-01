import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  copy: {
    border: "1 solid #000",
    padding: 14,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid #000",
    paddingBottom: 8,
    marginBottom: 8,
  },
  schoolName: { fontSize: 16, fontWeight: 700 },
  copyLabel: { fontSize: 9, color: "#444", textTransform: "uppercase" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#444" },
  value: { fontWeight: 700 },
  table: { marginTop: 10, border: "1 solid #000" },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #000" },
  tableRowLast: { flexDirection: "row" },
  th: { flex: 1, padding: 5, fontWeight: 700, backgroundColor: "#eee" },
  td: { flex: 1, padding: 5 },
  tdRight: { flex: 1, padding: 5, textAlign: "right" },
  totalRow: { flexDirection: "row", borderTop: "1 solid #000", backgroundColor: "#f5f5f5" },
  footer: { marginTop: 10, fontSize: 8, color: "#555" },
});

export type VoucherPdfData = {
  schoolName: string;
  voucherNo: string;
  studentName: string;
  fatherName: string;
  rollNo: string;
  className: string;
  month: string;
  year: number;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  otherFee: number;
  fine: number;
  discount: number;
  totalAmount: number;
  dueDate: string;
  status: string;
};

function Copy({ data, copyLabel }: { data: VoucherPdfData; copyLabel: string }) {
  return (
    <View style={styles.copy} wrap={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.schoolName}>{data.schoolName}</Text>
          <Text style={styles.copyLabel}>Fee Voucher - {data.month} {data.year}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.copyLabel}>{copyLabel}</Text>
          <Text style={styles.value}>#{data.voucherNo}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Student Name</Text>
        <Text style={styles.value}>{data.studentName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Father Name</Text>
        <Text style={styles.value}>{data.fatherName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Roll No</Text>
        <Text style={styles.value}>{data.rollNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Class</Text>
        <Text style={styles.value}>{data.className}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Due Date</Text>
        <Text style={styles.value}>{data.dueDate}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.th}>Description</Text>
          <Text style={{ ...styles.th, textAlign: "right" }}>Amount</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.td}>Tuition Fee</Text>
          <Text style={styles.tdRight}>{data.tuitionFee.toFixed(2)}</Text>
        </View>
        {data.admissionFee > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.td}>Admission Fee</Text>
            <Text style={styles.tdRight}>{data.admissionFee.toFixed(2)}</Text>
          </View>
        )}
        {data.examFee > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.td}>Exam Fee</Text>
            <Text style={styles.tdRight}>{data.examFee.toFixed(2)}</Text>
          </View>
        )}
        {data.otherFee > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.td}>Other Fee</Text>
            <Text style={styles.tdRight}>{data.otherFee.toFixed(2)}</Text>
          </View>
        )}
        {data.fine > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.td}>Late Fine</Text>
            <Text style={styles.tdRight}>{data.fine.toFixed(2)}</Text>
          </View>
        )}
        {data.discount > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.td}>Discount</Text>
            <Text style={styles.tdRight}>-{data.discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={{ ...styles.td, fontWeight: 700 }}>Total Payable</Text>
          <Text style={{ ...styles.tdRight, fontWeight: 700 }}>
            {data.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Status: {data.status}</Text>
        <Text>Please pay before the due date to avoid late fine. This is a computer generated voucher.</Text>
      </View>
    </View>
  );
}

export function VoucherDocument({ data }: { data: VoucherPdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Copy data={data} copyLabel="School Copy" />
        <Copy data={data} copyLabel="Bank Copy" />
        <Copy data={data} copyLabel="Student Copy" />
      </Page>
    </Document>
  );
}
