import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

const InvoiceViewer = ({ invoiceId, visible, onCancel }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pdfBlob, setPdfBlob] = useState(null);

    const url = `http://localhost:8000/invoice/${invoiceId}/create-pdf-ozan/`;

    const fetchPDF = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }
            const pdfBlob = await response.blob();
            setPdfBlob(pdfBlob);
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    useEffect(() => {
        if (invoiceId) {
            fetchPDF();
        }
    }, [invoiceId]);

    if (!pdfBlob) {
        return null; // PDF henüz yüklenmediyse hiçbir şey render etme
    }

    const pdfEmbed = (
        <embed
            src={URL.createObjectURL(pdfBlob)}
            type="application/pdf"
            style={{
                width: '100%',
                height: '80vh',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease', // Zoom için yumuşak geçiş
                objectFit: 'contain', // PDF'nin kutuya sığmasını sağla
            }}
        />
    );

    return (
        <Modal
            visible={visible}
            footer={null} // Zoom butonları dışında hiçbir şey eklemiyoruz
            width="90%" // Modal genişliği
            height="90vh" // Modal yüksekliği
            onCancel={onCancel} // Modal kapanması için
            title="Invoice"
            bodyStyle={{ padding: '0' }}
        >
            <div style={{ position: 'relative' }}>
                {pdfEmbed}

              
            </div>
        </Modal>
    );
};

export default InvoiceViewer;
