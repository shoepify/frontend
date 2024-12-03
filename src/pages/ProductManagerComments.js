import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Alert, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const ProductManagerPage = () => {
    const [pendingComments, setPendingComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pending comments from the backend
    useEffect(() => {
        fetch('http://localhost:8000/pending_comments/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch pending comments');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setPendingComments(data);
                } else if (data.comments) {
                    setPendingComments(data.comments);
                } else {
                    throw new Error('Unexpected response format');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleApprove = (commentId) => {
        fetch(`http://localhost:8000/update_approval/${commentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ approval_status: 'approved' }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to approve the comment');
                }
                setPendingComments((prevComments) =>
                    prevComments.filter((comment) => comment.comment_id !== commentId)
                );
            })
            .catch((err) => {
                alert('Error approving comment: ' + err.message);
            });
    };

    const handleDisapprove = (commentId) => {
        fetch(`http://localhost:8000/disapprove_comment/${commentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to disapprove the comment');
                }
                setPendingComments((prevComments) =>
                    prevComments.filter((comment) => comment.comment_id !== commentId)
                );
            })
            .catch((err) => {
                alert('Error disapproving comment: ' + err.message);
            });
    };

    if (loading) {
        return <Spin tip="Loading pending comments..." style={{ marginTop: 50 }} />;
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: 50 }}
            />
        );
    }

    if (pendingComments.length === 0) {
        return (
            <Alert
                message="No Pending Comments"
                description="There are currently no pending comments for approval."
                type="info"
                showIcon
                style={{ marginTop: 50 }}
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ marginBottom: '20px' }}>
                Pending Comments
            </Title>
            {pendingComments.map((comment) => (
                <Card
                    key={comment.comment_id}
                    style={{ marginBottom: '20px' }}
                    bordered
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Text>
                            <strong>Customer ID:</strong> {comment.customer_id}
                        </Text>
                        <Text>
                            <strong>Comment:</strong> {comment.comment}
                        </Text>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => handleApprove(comment.comment_id)}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                onClick={() => handleDisapprove(comment.comment_id)}
                            >
                                Disapprove
                            </Button>
                        </Space>
                    </Space>
                </Card>
            ))}
        </div>
    );
};

export default ProductManagerPage;
