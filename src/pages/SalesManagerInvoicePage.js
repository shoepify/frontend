import React, { useState } from "react";
import { Table, Button, DatePicker, Typography, message } from "antd";
import moment from "moment"; // Ensure moment is imported

const { Title } = Typography;
const { RangePicker } = DatePicker;

const SalesManagerInvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState([null, null]); // State to hold selected date range

    // Function to fetch invoices based on date range
    const fetchInvoices = (startDate, endDate) => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/invoices/date-range/?start_date=${startDate}&end_date=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const fetchedInvoices = data.invoices || [];
                setInvoices(fetchedInvoices);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
                message.error("Failed to fetch invoices");
                setLoading(false);
            });
    };

    // Handle date range change and update state
    const handleDateRangeChange = (dates) => {
        if (!dates) return;
        const [startDate, endDate] = dates;
        setSelectedDates([startDate, endDate]);

        // Format and fetch invoices with formatted dates
        const formattedStartDate = startDate.format("YYYY-MM-DD");
        const formattedEndDate = endDate.format("YYYY-MM-DD");
        fetchInvoices(formattedStartDate, formattedEndDate);
    };

    // Function to download invoices PDF
    const downloadPDF = () => {
        if (!invoices.length || !selectedDates[0] || !selectedDates[1]) {
            message.warning("No invoices available or date range not selected.");
            return;
        }

        // Get formatted start and end dates from selectedDates state
        const formattedStartDate = selectedDates[0].format("YYYY-MM-DD");
        const formattedEndDate = selectedDates[1].format("YYYY-MM-DD");

        window.open(
            `http://127.0.0.1:8000/invoices/date-range/pdf/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
            "_blank"
        );
    };

    // Table columns for invoices
    const invoiceColumns = [
        {
            title: "Invoice ID",
            dataIndex: "invoice_id",
            key: "invoice_id",
        },
        {
            title: "Order ID",
            dataIndex: "order_id",
            key: "order_id",
        },
        {
            title: "Invoice Date",
            dataIndex: "invoice_date",
            key: "invoice_date",
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3}>Sales Manager Invoice Page</Title>
            <RangePicker
                onChange={handleDateRangeChange}
                style={{ marginBottom: "20px" }}
            />

            {/* Invoice Table */}
            <Table
                dataSource={invoices}
                columns={invoiceColumns}
                rowKey="invoice_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                style={{ marginBottom: "20px" }}
            />

            <Button type="primary" onClick={downloadPDF}>
                Download Invoices PDF
            </Button>
        </div>
    );
};

export default SalesManagerInvoicePage;
