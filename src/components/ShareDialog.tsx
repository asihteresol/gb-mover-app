import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Mail } from 'lucide-react';
import { TicketData } from '../types/ticket';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format the ticket message neatly for WhatsApp, Email, Facebook, etc.
  const ticketSummaryText = `🚌 *GBMovers - Official Ticket Slip*
━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket No:* ${ticket.ticketNo}
👤 *Passenger:* ${ticket.passengerName}${ticket.passengerCnic ? `\n🪪 *CNIC:* ${ticket.passengerCnic}` : ''}
🛣️ *Route:* ${ticket.fromCity} ➔ ${ticket.toCity}
🚍 *Bus Type:* ${ticket.busType}
💺 *Seat Number:* ${ticket.seatNumber}${ticket.seatCount && ticket.seatCount > 1 ? ` (${ticket.seatCount} Seats)` : ''}
📅 *Departure Date:* ${ticket.departureDate}
⏰ *Departure Time:* ${ticket.departureTime}
⏱️ *Reporting Time:* ${ticket.reportingTime || '15 mins before'}
━━━━━━━━━━━━━━━━━━━━━
${ticket.seatCount && ticket.seatCount > 1
  ? `💰 *Fare per Seat:* Rs. ${ticket.fare.toLocaleString()}
🔢 *Subtotal (${ticket.seatCount} seats):* Rs. ${(ticket.subTotal || (ticket.fare * ticket.seatCount)).toLocaleString()}
🏷️ *Discount per Seat:* Rs. ${ticket.discount.toLocaleString()} (Total: -Rs. ${(ticket.totalDiscount || (ticket.discount * ticket.seatCount)).toLocaleString()})`
  : `💰 *Fare:* Rs. ${ticket.fare.toLocaleString()}
🏷️ *Discount:* Rs. ${ticket.discount.toLocaleString()}`}
💵 *Total Paid:* Rs. ${ticket.totalFare.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━
📞 *GBMovers Helpline:*
0312-0000000 / 0313-0000000
_Have a safe and comfortable journey with GBMovers!_`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = ticketSummaryText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(ticketSummaryText);
    const url = ticket.passengerPhone
      ? `https://api.whatsapp.com/send?phone=${ticket.passengerPhone.replace(/[^0-9]/g, '')}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const shareUrl = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(
      `GBMovers Ticket #${ticket.ticketNo} for ${ticket.passengerName} (${ticket.fromCity} to ${ticket.toCity})`
    )}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
  };

  const handleGmailShare = () => {
    const subject = encodeURIComponent(
      `GBMovers E-Ticket Slip - ${ticket.ticketNo} (${ticket.passengerName})`
    );
    const body = encodeURIComponent(ticketSummaryText);
    // Open Gmail directly if possible, or standard mailto
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GBMovers Ticket - ${ticket.ticketNo}`,
          text: ticketSummaryText,
          url: window.location.href,
        });
        onClose();
      } catch (err) {
        console.log('User cancelled share', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Share Ticket Slip
              </h3>
              <p className="text-[11px] text-slate-500">
                Ticket: {ticket.ticketNo} · {ticket.passengerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Channels */}
        <div className="p-4 space-y-2.5">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-emerald-950">
                  Share on WhatsApp
                </div>
                <div className="text-xs text-emerald-700">
                  Send directly to passenger or chat
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              Send →
            </span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold text-lg">
                f
              </div>
              <div>
                <div className="font-bold text-sm text-blue-950">
                  Share to Facebook
                </div>
                <div className="text-xs text-blue-700">
                  Post or message on Facebook
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform">
              Post →
            </span>
          </button>

          {/* Gmail / Email Button */}
          <button
            onClick={handleGmailShare}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-200 transition-colors group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-red-950">
                  Share via Gmail / Email
                </div>
                <div className="text-xs text-red-700">
                  Email complete ticket breakdown
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-red-700 group-hover:translate-x-0.5 transition-transform">
              Email →
            </span>
          </button>

          {/* Native Share on mobile or Copy */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>More Options</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
