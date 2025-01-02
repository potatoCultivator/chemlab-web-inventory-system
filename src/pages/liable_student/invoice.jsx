import React, { useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Box,
  Button,
} from '@mui/material';
import {
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Timestamp } from 'firebase/firestore';

const InvoiceForm = ({student}) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
    onBeforeGetContent: () => {
      document.body.classList.add('print-mode');
    },
    onAfterPrint: () => {
      document.body.classList.remove('print-mode');
    },
  });

  const handleDownloadPDF = () => {
    const input = componentRef.current.querySelector('.card-content');
    const scale = 2; // Scale for higher resolution
    html2canvas(input, {
      scale, // Increase the canvas resolution
      backgroundColor: null, // Maintain transparency
      useCORS: true, // Handle cross-origin resources
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    });
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // hour12: true,
    });
  };

  return (
    <div>
      <style>
        {`
          @media print {
            body.print-mode * {
              visibility: hidden;
            }
            body.print-mode .printable {
              visibility: visible;
            }
            body.print-mode .printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div ref={componentRef} className="printable" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Card
  className="card-content"
  sx={{
    p: 3,
    width: '210mm',
    minHeight: '297mm',
    margin: 'auto',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '25.4mm 19.05mm',
  }}
>
          <CardContent>
            {/* Invoice Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold">Invoice {student.issueID}</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Borrower Information */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <UserOutlined /> Borrower:
                </Typography>
                <Typography>Name: {student.borrower}</Typography>
                <Typography>ID: {student.studentID  }</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <ClockCircleOutlined /> Issue Details:
                </Typography>
                <Typography>Date Issued: {formatDate(student.date_issued)}</Typography>
                <Typography>Due Date: {formatDate(student.due_date)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

                  <Table>
                    <TableHead>
                    <TableRow>
                      <TableCell>Equipment Name</TableCell>
                      <TableCell align='center'>Capacity</TableCell>
                      <TableCell align='center'>Unit</TableCell>
                      <TableCell align='center'>Quantity</TableCell>
                      <TableCell align='center'>Replaced</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {student.equipments.map((equipment, index) => (
                      <TableRow key={index}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell align='center'>{equipment.capacity}</TableCell>
                      <TableCell align='center'>{equipment.unit}</TableCell>
                      <TableCell align='center'>{equipment.qty}</TableCell>
                      <TableCell align='center'>{equipment.replaced ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                      <TableCell align='right' colSpan={3}>Total Quantity:</TableCell>
                      <TableCell align='center' colSpan={1}> {student.equipments.reduce((total, equipment) => total + equipment.qty, 0)}</TableCell>
                    </TableBody>
                  </Table>

              <Box mt={4} p={2} sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Description:</Typography>
              <Typography variant="body2">
                {student.description}
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Terms and Conditions:</Typography>
              <Typography variant="body2">
              Replacement of damaged or not working equipment shall be made by students before the due date. Otherwise, penalties may be given, or it may delay or restrict the use of equipment in the future.
              </Typography>
            </Box>
          </CardContent>

          {/* Signature Section */}
          <Box mt={4} display="flex" justifyContent="space-between" sx={{ p: 3 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Borrower's Signature:</Typography>
              <Box mt={2} sx={{ borderBottom: '1px solid #000', width: '200px' }}></Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Issuer's Signature:</Typography>
              <Box mt={2} sx={{ borderBottom: '1px solid #000', width: '200px' }}></Box>
            </Box>
          </Box>
        </Card>
      </div>

      {/* Print and Download Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
        <Button onClick={handleDownloadPDF} 
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  color: 'white',
                },
              }}
            >Download PDF</Button>
      </Box>
    </div>
  );
};

export default InvoiceForm;
