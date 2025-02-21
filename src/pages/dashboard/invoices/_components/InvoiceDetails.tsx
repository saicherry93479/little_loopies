import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { numberToWords } from "@/lib/utils/utilfunctions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceDetails({ invoice }: { invoice: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shippingAddress = JSON.parse(invoice.shippingAddress) || {};

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("invoice-content");
      if (!element) return;

      // Hide buttons before capturing
      const actionButtons = document.getElementById("action-buttons");
      if (actionButtons) {
        actionButtons.style.display = "none";
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        letterRendering: true,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);

      // Show buttons again
      if (actionButtons) {
        actionButtons.style.display = "flex";
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          View Invoice
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="p-8" id="invoice-content">
          {/* Header Section */}
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold text-blue-600">
              Packed Freshly
            </h1>
            <div className="text-right">
              <h2 className="text-xl mb-2">Invoice #</h2>
              <p className="text-gray-600">{invoice.invoiceNumber}</p>
              <p className="mt-4">Hyderbad</p>
              <p>500096, Hyderabad</p>
              <p>India</p>
            </div>
          </div>

          {/* Billing Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Bill to:</h3>
              <p className="font-medium">{invoice.customerName}</p>
              {shippingAddress && (
                <>
                  <p className="text-gray-600">
                    {shippingAddress.street}, {shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">{shippingAddress.city}, India</p>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Invoice date: </span>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Due date: </span>
                  Invalid Date
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">ITEM</th>
                  <th className="text-center py-2">QTY</th>
                  <th className="text-right py-2">RATE</th>
                  <th className="text-right py-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{item.unitPrice} INR</td>
                    <td className="text-right">{item.totalPrice} INR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-8 text-right">
            <div className="space-y-2">
              <p>Subtotal: {invoice.amount} INR</p>
              <p className="font-bold">Total: {invoice.amount} INR</p>
              <p className="text-gray-600 italic">
                {numberToWords(invoice.amount)} INR
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 space-y-4 text-gray-600">
            <h4 className="text-blue-600 font-semibold">Additional notes:</h4>
            <div>
              <h5 className="font-semibold">Payment terms:</h5>
              <p>This order is COD, please kindly do cash on delivery.😊</p>
            </div>

            {invoice.paymentMethod !== "cod" && (
              <div>
                <h5 className="font-semibold">
                  Please send the payment to this address
                </h5>
                <p>Bank:</p>
                <p>Account name:</p>
                <p>Account no:</p>
              </div>
            )}

            <div className="mt-8">
              <p>
                If you have any questions concerning this invoice, use the
                following contact information:
              </p>
              <p>packedfreshly@gmail.com</p>
              <p>9515235212</p>
            </div>
          </div>

          {/* Actions */}
          <div id="action-buttons" className="mt-8 flex justify-end space-x-4">
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
