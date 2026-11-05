import React, { useState, useRef } from 'react';
import { Printer, Share2, X, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { TicketData } from '../types/ticket';
import { ThermalSlip } from './ThermalSlip';
import { ShareDialog } from './ShareDialog';
import { toPng } from 'html-to-image';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData | null;
  onNewBooking?: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onNewBooking,
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const receiptContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const handleDownload = async () => {
    const slipElement = document.getElementById('thermal-print-container');
    if (!slipElement) return;

    try {
      setIsDownloading(true);
      // Generate clean PNG image of the 80mm slip
      const dataUrl = await toPng(slipElement, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });

      // Trigger browser download
      const link = document.createElement('a');
      link.download = `${ticket.ticketNo}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to download slip', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareClick = async () => {
    const ticketSummaryText = `🚌 GBMovers - Official Ticket Slip
━━━━━━━━━━━━━━━━━━━━━
Ticket No: ${ticket.ticketNo}
Passenger: ${ticket.passengerName}${ticket.passengerCnic ? `\nCNIC: ${ticket.passengerCnic}` : ''}
Route: ${ticket.fromCity} ➔ ${ticket.toCity}
Bus Type: ${ticket.busType}
Seat Number: ${ticket.seatNumber}${ticket.seatCount && ticket.seatCount > 1 ? ` (${ticket.seatCount} Seats)` : ''}
Departure Date: ${ticket.departureDate}
Departure Time: ${ticket.departureTime}
Reporting Time: ${ticket.reportingTime || '15 mins before'}
━━━━━━━━━━━━━━━━━━━━━
${ticket.seatCount && ticket.seatCount > 1
  ? `Fare per Seat: Rs. ${ticket.fare.toLocaleString()}
Subtotal (${ticket.seatCount} seats): Rs. ${(ticket.subTotal || (ticket.fare * ticket.seatCount)).toLocaleString()}
Discount per Seat: Rs. ${ticket.discount.toLocaleString()} (Total Discount: -Rs. ${(ticket.totalDiscount || (ticket.discount * ticket.seatCount)).toLocaleString()})`
  : `Standard Fare: Rs. ${ticket.fare.toLocaleString()}
Discount: Rs. ${ticket.discount.toLocaleString()}`}
Total Paid: Rs. ${ticket.totalFare.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━
Helpline: 0312-0000000 / 0313-0000000
Have a safe journey with GBMovers!`;

    // Try native share sheet first (standard on mobile for WhatsApp, Facebook, Gmail, etc.)
    if (navigator.share) {
      try {
        // If slip element exists, attempt to share image file too
        const slipElement = document.getElementById('thermal-print-container');
        if (slipElement && navigator.canShare) {
          try {
            const dataUrl = await toPng(slipElement, {
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
            });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `GBMovers-${ticket.ticketNo}.png`, {
              type: 'image/png',
            });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `GBMovers Ticket - ${ticket.ticketNo}`,
                text: ticketSummaryText,
                files: [file],
              });
              return;
            }
          } catch (fileErr) {
            console.log('File sharing skipped, sharing text', fileErr);
          }
        }

        await navigator.share({
          title: `GBMovers Ticket - ${ticket.ticketNo}`,
          text: ticketSummaryText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User aborted or error, if not abort, open fallback dialog
        if ((err as Error).name !== 'AbortError') {
          setShowShareDialog(true);
        }
      }
    } else {
      // Desktop / browsers without navigator.share
      setShowShareDialog(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-800">
          {/* Top Modal Navigation Header */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  Ticket Generated
                </h3>
                <p className="text-[11px] text-slate-400">
                  80mm ESC/POS Thermal Receipt
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thermal Receipt Preview Area */}
          <div
            ref={receiptContainerRef}
            className="p-3 sm:p-6 bg-slate-900/60 overflow-y-auto max-h-[64vh] flex flex-col items-center"
          >
            <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5 no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Standard 80mm Thermal Paper Format</span>
            </div>

            {/* The 80mm Slip */}
            <div className="rounded-sm shadow-xl overflow-hidden">
              <ThermalSlip ticket={ticket} id="thermal-print-container" />
            </div>
          </div>

          {/* Bottom Action Bar: PRINT, SHARE, and DOWNLOAD */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              {/* PRINT BUTTON */}
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="h-12 px-2 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                title="Print 80mm Receipt"
              >
                <Printer className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span>Print</span>
              </button>

              {/* SHARE BUTTON */}
              <button
                onClick={handleShareClick}
                className="h-12 px-2 sm:px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-md shadow-blue-950/40 cursor-pointer"
                title="Share via WhatsApp, Facebook, Gmail, etc."
              >
                <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span>Share</span>
              </button>

              {/* DOWNLOAD BUTTON */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-12 px-2 sm:px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
                title="Download 80mm Slip Image (PNG)"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary actions: Done / New Ticket */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors py-1 px-2"
              >
                Close
              </button>
              {onNewBooking && (
                <button
                  onClick={() => {
                    onClose();
                    onNewBooking();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2"
                >
                  + Book Another Seat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog for WhatsApp, Facebook, Gmail Fallback */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        ticket={ticket}
      />
    </>
  );
};
