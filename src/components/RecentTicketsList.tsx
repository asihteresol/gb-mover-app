import React from 'react';
import { TicketData } from '../types/ticket';
import { Ticket, Printer, Share2, Eye, Trash2, ArrowRight } from 'lucide-react';

interface RecentTicketsListProps {
  tickets: TicketData[];
  onViewTicket: (ticket: TicketData) => void;
  onPrintTicket: (ticket: TicketData) => void;
  onShareTicket: (ticket: TicketData) => void;
  onDeleteTicket: (ticketId: string) => void;
  onClearAll: () => void;
}

export const RecentTicketsList: React.FC<RecentTicketsListProps> = ({
  tickets,
  onViewTicket,
  onPrintTicket,
  onShareTicket,
  onDeleteTicket,
  onClearAll,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Ticket className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">No Saved Tickets Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Fill in the booking form above and generate your first 80mm thermal ticket slip.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Recent Tickets ({tickets.length})
          </h3>
          <p className="text-xs text-slate-500">
            Past bookings saved locally for quick re-print or re-share
          </p>
        </div>
        {tickets.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium px-2 py-1"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Left summary */}
            <div className="flex items-start gap-3">
              <div className="min-w-10 h-10 px-1 rounded-xl bg-slate-900 text-emerald-400 flex flex-col items-center justify-center font-receipt font-bold text-xs shrink-0">
                <span className="truncate max-w-[50px]">{t.seatNumber}</span>
                <span className="text-[7.5px] text-slate-400 font-sans uppercase">
                  {t.seatCount && t.seatCount > 1 ? `${t.seatCount} SEATS` : 'SEAT'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {t.passengerName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {t.ticketNo}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-medium">
                  <span>{t.fromCity}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{t.toCity}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700">{t.busType}</span>
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dep: {t.departureDate} at {t.departureTime} · Total: Rs. {t.totalFare.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Right action buttons */}
            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              <button
                onClick={() => onViewTicket(t)}
                className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="View Thermal Slip"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Slip</span>
              </button>

              <button
                onClick={() => onPrintTicket(t)}
                className="h-8 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Print 80mm Slip"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => onShareTicket(t)}
                className="h-8 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Share on WhatsApp/Social"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => onDeleteTicket(t.id)}
                className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
