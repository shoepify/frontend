import React, { useState } from "react";
import { Table, Button, DatePicker, Typography, Card, Row, Col, message } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SalesManagerDashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);

    const fetchInvoices = (startDate, endDate) => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/invoices/date-range/?start_date=${startDate}&end_date=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                const fetchedInvoices = data.invoices || [];
                setInvoices(fetchedInvoices);
                calculateSummaryAndChart(fetchedInvoices);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
                message.error("Failed to fetch invoices");
                setLoading(false);
            });
    };

    const calculateSummaryAndChart = (invoices) => {
        if (!invoices.length) {
            setSummaryData(null);
            setChartData(null);
            return;
        }

        // Group invoices by date
        const dailyData = invoices.reduce((acc, invoice) => {
            const { invoice_date, total_amount } = invoice;
            acc[invoice_date] = (acc[invoice_date] || 0) + parseFloat(total_amount);
            return acc;
        }, {});

        // Calculate total revenue and profit (for simplicity, assuming profit = revenue - 0)
        const totalRevenue = Object.values(dailyData).reduce((sum, revenue) => sum + revenue, 0);
        const totalCost = 0; // Replace this with actual cost data if available
        const profitLoss = totalRevenue - totalCost;

        // Update summary
        setSummaryData({ totalRevenue, totalCost, profitLoss });

        // Prepare chart data
        const labels = Object.keys(dailyData).sort(); // Sort by date
        const data = labels.map((date) => dailyData[date]);

        setChartData({
            labels,
            datasets: [
                {
                    label: "Daily Revenue",
                    data,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Profit (Assuming no cost)",
                    data,
                    borderColor: "green",
                    borderDash: [5, 5],
                    fill: false,
                },
            ],
        });
    };

    const handleDateRangeChange = (dates) => {
        if (!dates) return;
        const [startDate, endDate] = dates.map((date) => date.format("YYYY-MM-DD"));
        fetchInvoices(startDate, endDate);
    };

    const downloadPDF = () => {
        if (!invoices.length) {
            message.warning("No invoices available for the selected date range.");
            return;
        }
        const startDate = invoices[0]?.invoice_date;
        const endDate = invoices[invoices.length - 1]?.invoice_date;
        window.open(
            `http://127.0.0.1:8000/invoices/date-range/pdf/?start_date=${startDate}&end_date=${endDate}`,
            "_blank"
        );
    };

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
            <Title level={3}>Sales Manager Dashboard</Title>
            <RangePicker onChange={handleDateRangeChange} style={{ marginBottom: "20px" }} />

            {/* Revenue and Profit/Loss Summary */}
            {summaryData && (
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                    <Col span={8}>
                        <Card>
                            <Text>Total Revenue:</Text>
                            <Title level={4}>${summaryData.totalRevenue.toFixed(2)}</Title>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Text>Total Cost:</Text>
                            <Title level={4}>${summaryData.totalCost.toFixed(2)}</Title>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Text>Profit/Loss:</Text>
                            <Title level={4}>${summaryData.profitLoss.toFixed(2)}</Title>
                        </Card>
                    </Col>
                </Row>
            )}

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

            {/* Daily Revenue and Profit Chart */}
            {chartData && (
                <div style={{ marginTop: "30px" }}>
                    <Title level={4}>Daily Revenue and Profit</Title>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default SalesManagerDashboard;
