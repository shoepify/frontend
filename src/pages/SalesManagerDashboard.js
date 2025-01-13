import React, { useState } from "react";
import { Button, DatePicker, Typography, Card, Row, Col, message } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SalesManagerDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);

    const fetchData = (startDate, endDate) => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/revenue/profit-loss/data/")
            .then((response) => response.json())
            .then((data) => {
                const fetchedData = data.data || [];
                // Filter data based on the selected date range
                const filteredData = fetchedData.filter(
                    (item) => item.date >= startDate && item.date <= endDate
                );
                setData(filteredData);
                calculateSummaryAndChart(filteredData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                message.error("Failed to fetch data");
                setLoading(false);
            });
    };

    const calculateSummaryAndChart = (data) => {
        if (!data.length) {
            setSummaryData(null);
            setChartData(null);
            return;
        }

        // Calculate total revenue, cost, and profit
        const totalRevenue = data.reduce((sum, item) => sum + item.daily_revenue, 0);
        const totalCost = data.reduce((sum, item) => sum + item.daily_cost, 0);
        const profitLoss = totalRevenue - totalCost;

        // Update summary data
        setSummaryData({ totalRevenue, totalCost, profitLoss });

        // Prepare chart data
        const labels = data.map((item) => item.date);
        const revenueData = data.map((item) => item.daily_revenue || 0);
        const costData = data.map((item) => item.daily_cost || 0);
        const profitData = data.map((item) => item.daily_profit || 0);

        setChartData({
            labels,
            datasets: [
                {
                    label: "Daily Revenue",
                    data: revenueData,
                    borderColor: "blue",
                    fill: false,
                    steppedLine: true, // For discrete steps in the line
                },
                {
                    label: "Daily Cost",
                    data: costData,
                    borderColor: "red",
                    fill: false,
                    steppedLine: true, // For discrete steps in the line
                },
                {
                    label: "Profit (Revenue - Cost)",
                    data: profitData,
                    borderColor: "green",
                    fill: false,
                    steppedLine: true, // For discrete steps in the line
                },
            ],
        });
    };

    const handleDateRangeChange = (dates) => {
        if (!dates) return;
        const [startDate, endDate] = dates.map((date) => date.format("YYYY-MM-DD"));
        fetchData(startDate, endDate);
    };

    const downloadPDF = () => {
        if (!data.length) {
            message.warning("No data available for the selected date range.");
            return;
        }
        const startDate = data[0]?.date;
        const endDate = data[data.length - 1]?.date;
        window.open(
            `http://127.0.0.1:8000/revenue/profit-loss/data/pdf/?start_date=${startDate}&end_date=${endDate}`,
            "_blank"
        );
    };

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

            {/* Daily Revenue, Cost, and Profit Chart */}
            {chartData && (
                <div style={{ marginTop: "30px" }}>
                    <Title level={4}>Daily Revenue, Cost, and Profit</Title>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default SalesManagerDashboard;
