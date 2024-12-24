import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, List, Card, Spin, Alert } from "antd";

const { Title, Text } = Typography;

const ApprovedComments = () => {
    const { productId } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${productId}/comments/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    setComments([]);
                    setLoading(false);
                    return [];
                }
                if (!response.ok) {
                    throw new Error("Unexpected error while fetching comments.");
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const approvedComments = data.filter(comment => comment.approval_status === "Approved");
                    setComments(approvedComments);
                } else if (data.comments) {
                    const approvedComments = data.comments.filter(comment => comment.approval_status === "Approved");
                    setComments(approvedComments);
                } else {
                    setComments([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return <Spin tip="Loading comments..." style={{ display: 'block', margin: '20px auto' }} />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 20 }} />;
    }

    if (comments.length === 0) {
        return <Alert message="No approved comments found for this product." type="info" showIcon style={{ marginBottom: 20 }} />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>Approved Comments</Title>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={comments}
                renderItem={(comment) => (
                    <List.Item>
                        <Card>
                            <Text strong>Customer ID:</Text> <Text>{comment.customer_id}</Text>
                            <br />
                            <Text strong>Comment:</Text>
                            <Text>{` ${comment.comment}`}</Text>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ApprovedComments;
