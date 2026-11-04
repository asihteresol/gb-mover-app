import React from 'react';
import { TicketData } from '../types/ticket';
import { GBMoversLogo } from './GBMoversLogo';

interface ThermalSlipProps {
  ticket: TicketData;
  id?: string;
}

export const ThermalSlip: React.FC<ThermalSlipProps> = ({ ticket, id = 'thermal-print-container' }) => {
  return (
    <div
      id={id}
      className="w-[80mm] max-w-[80mm] min-w-[80mm] mx-auto bg-white text-black p-4 font-receipt text-[11px] leading-tight select-none shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-1"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Decorative top tear pattern for preview */}
      <div className="receipt-tear-top h-2.5 -mt-4 -mx-4 mb-3 border-b border-black/10 print:hidden" />

      {/* Header with Company Logo */}
      <div className="text-center space-y-1">
        <GBMoversLogo isReceipt={true} size="md" className="mx-auto" />

        <div className="text-[10px] uppercase font-bold tracking-wider mt-1">
          *** PASSENGER BOARDING SLIP ***
        </div>

        {/* 2 Contact Numbers Required by User */}
        <div className="border-t border-b border-black border-dashed py-1.5 my-1.5">
          <div className="text-[10px] font-bold tracking-wide">
            HELPLINE & BOOKINGS:
          </div>
          <div className="flex items-center justify-center gap-2 font-bold text-[12px] tracking-wider">
            <span>0312-0000000</span>
            <span>·</span>
            <span>0313-0000000</span>
          </div>
        </div>
      </div>

      {/* Ticket Meta Details */}
      <div className="space-y-1 text-[11px] mt-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">TICKET NO:</span>
          <span className="font-bold text-[13px] tracking-wider">{ticket.ticketNo}</span>
        </div>
        <div className="flex justify-between items-center text-slate-700 print:text-black">
          <span>ISSUED ON:</span>
          <span>{ticket.issueDate}</span>
        </div>
        <div className="flex justify-between items-center text-slate-700 print:text-black">
          <span>OPERATOR:</span>
          <span>{ticket.issuedBy || 'Cashier Desk 01'}</span>
        </div>
      </div>

      <div className="border-t border-black border-dashed my-2" />

      {/* Route & Journey Details */}
      <div className="space-y-1.5">
        <div className="bg-black/5 print:bg-transparent p-1.5 rounded-sm border border-black/20 text-center">
          <div className="text-[9px] uppercase tracking-wider text-slate-700 print:text-black">
            JOURNEY ROUTE
          </div>
          <div className="font-bold text-[13px] tracking-wide mt-0.5">
            {ticket.fromCity.toUpperCase()} ➔ {ticket.toCity.toUpperCase()}
          </div>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-slate-800 print:text-black">PASSENGER:</span>
          <span className="font-bold uppercase text-[12px] text-right">{ticket.passengerName}</span>
        </div>

        {ticket.passengerPhone && (
          <div className="flex justify-between">
            <span className="text-slate-800 print:text-black">PHONE:</span>
            <span className="font-bold">{ticket.passengerPhone}</span>
          </div>
        )}

        {ticket.passengerCnic && (
          <div className="flex justify-between">
            <span className="text-slate-800 print:text-black">CNIC NO:</span>
            <span className="font-bold tracking-wider">{ticket.passengerCnic}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-slate-800 print:text-black">BUS TYPE:</span>
          <span className="font-bold text-right uppercase">{ticket.busType}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-800 print:text-black">BUS NAME:</span>
          <span className="font-bold text-right uppercase">{ticket.busName}</span>
        </div>

        {/* Prominent Seat Number */}
        <div className="flex justify-between items-center bg-black text-white p-1 px-2 rounded-sm print:bg-black print:text-white">
          <span className="font-bold text-[11px] tracking-wider">SEAT NO:</span>
          <span className="font-extrabold text-[15px] tracking-widest">{ticket.seatNumber}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-800 print:text-black">DEP. DATE:</span>
          <span className="font-bold text-[12px]">{ticket.departureDate}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-800 print:text-black">DEP. TIME:</span>
          <span className="font-bold text-[12px]">{ticket.departureTime}</span>
        </div>

        <div className="flex justify-between text-[10px] text-slate-700 print:text-black">
          <span>REPORTING TIME:</span>
          <span className="font-semibold">{ticket.reportingTime || '15 Mins Before'}</span>
        </div>
      </div>

      <div className="border-t border-black border-dashed my-2" />

      {/* Fare Breakdown */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-center">
          FARE BREAKDOWN
        </div>

        <div className="flex justify-between text-[11px]">
          <span>Standard Fare:</span>
          <span className="font-semibold">Rs. {ticket.fare.toLocaleString()}</span>
        </div>

        {ticket.discount > 0 ? (
          <div className="flex justify-between text-[11px]">
            <span>Special Discount:</span>
            <span className="font-semibold">- Rs. {ticket.discount.toLocaleString()}</span>
          </div>
        ) : (
          <div className="flex justify-between text-[11px] text-slate-600 print:text-black">
            <span>Discount:</span>
            <span>Rs. 0</span>
          </div>
        )}

        <div className="border-t border-black my-1" />

        <div className="flex justify-between items-baseline text-[14px] font-extrabold">
          <span>NET PAYABLE:</span>
          <span className="tracking-tight text-[15px]">Rs. {ticket.totalFare.toLocaleString()}</span>
        </div>
        <div className="text-[9px] text-right text-slate-700 print:text-black italic">
          (Payment Status: PAID / CASH)
        </div>
      </div>

      <div className="border-t border-black border-dashed my-2.5" />

      {/* Important Terms & Notice */}
      <div className="text-[8.5px] leading-tight space-y-1 text-slate-700 print:text-black">
        <div className="font-bold text-black uppercase text-center text-[9px]">
          TERMS & CONDITIONS
        </div>
        <p>1. Please report at terminal 15 mins before scheduled departure.</p>
        <p>2. Luggage up to 20kg is free; overweight subject to cargo charges.</p>
        <p>3. Ticket non-refundable within 2 hours of departure.</p>
        <p>4. Keep this 80mm slip safe until your journey completes.</p>
      </div>

      <div className="text-center mt-3 pt-2 border-t border-black border-dotted">
        <div className="font-bold text-[11px] tracking-wide">
          THANK YOU FOR TRAVELING WITH
        </div>
        <div className="font-extrabold text-[12px] tracking-widest uppercase">
          GBMOVERS
        </div>
        <div className="text-[10px] tracking-wide mt-0.5 font-bold uppercase">
          HAVE A SAFE & PLEASANT JOURNEY
        </div>
      </div>

      {/* Decorative bottom tear pattern for preview */}
      <div className="receipt-tear-bottom h-2.5 -mb-4 -mx-4 mt-3 border-t border-black/10 print:hidden" />
    </div>
  );
};
