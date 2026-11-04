import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SeatPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeat: string;
  onSelectSeat: (seatNo: string) => void;
  busType?: string;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  isOpen,
  onClose,
  selectedSeat,
  onSelectSeat,
  busType = 'Executive Luxury',
}) => {
  if (!isOpen) return null;

  // Pre-occupied sample seats to simulate realistic bus
  const bookedSeats = [3, 4, 7, 11, 12, 18, 22, 23, 29, 30];

  // Parse currently selected seats (could be "14" or "14, 15")
  const currentSelectedList = selectedSeat
    ? selectedSeat
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [activeSelection, setActiveSelection] = useState<string[]>(
    currentSelectedList.length > 0 ? currentSelectedList : []
  );

  const toggleSeat = (seatNum: string) => {
    if (activeSelection.includes(seatNum)) {
      setActiveSelection(activeSelection.filter((s) => s !== seatNum));
    } else {
      // Support selecting multiple seats or single seat
      setActiveSelection([...activeSelection, seatNum]);
    }
  };

  const handleConfirm = () => {
    onSelectSeat(activeSelection.join(', '));
    onClose();
  };

  // Generate 10 rows of 2x2 layout (total 40 seats)
  const rows = [];
  for (let r = 1; r <= 10; r++) {
    const left1 = (r - 1) * 4 + 1;
    const left2 = (r - 1) * 4 + 2;
    const right1 = (r - 1) * 4 + 3;
    const right2 = (r - 1) * 4 + 4;
    rows.push({
      rowNum: r,
      left: [left1.toString(), left2.toString()],
      right: [right1.toString(), right2.toString()],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h3 className="font-bold text-base">Select Seat Number</h3>
            <p className="text-xs text-slate-300">
              {busType} · 40-Seat Layout
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around py-2.5 px-4 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-700 text-white flex items-center justify-center text-[9px] font-bold">
              ✓
            </div>
            <span className="font-medium text-emerald-800">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300 text-slate-400" />
            <span>Booked</span>
          </div>
        </div>

        {/* Bus Cabin Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
          <div className="max-w-[280px] mx-auto bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
            {/* Front Driver Cabin & Door */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-slate-300 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                <span>🚪 Entry Door</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-md">
                <span>🎮 Driver</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row.rowNum} className="flex items-center justify-between gap-1">
                  {/* Left pair */}
                  <div className="flex items-center gap-1.5">
                    {row.left.map((seatNum) => {
                      const isBooked = bookedSeats.includes(parseInt(seatNum, 10));
                      const isSelected = activeSelection.includes(seatNum);

                      return (
                        <button
                          key={seatNum}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                            isBooked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                              : isSelected
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-1 font-bold shadow-xs'
                              : 'bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300 active:scale-95'
                          }`}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-6 text-center text-[10px] text-slate-300 select-none">
                    |
                  </div>

                  {/* Right pair */}
                  <div className="flex items-center gap-1.5">
                    {row.right.map((seatNum) => {
                      const isBooked = bookedSeats.includes(parseInt(seatNum, 10));
                      const isSelected = activeSelection.includes(seatNum);

                      return (
                        <button
                          key={seatNum}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                            isBooked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                              : isSelected
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-1 font-bold shadow-xs'
                              : 'bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300 active:scale-95'
                          }`}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Back Row */}
            <div className="mt-3 pt-2 text-center text-[10px] text-slate-400 border-t border-slate-200">
              Back Seat Row
            </div>
          </div>
        </div>

        {/* Footer with confirmation */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Selected:</div>
            <div className="text-sm font-bold text-slate-900">
              {activeSelection.length > 0
                ? activeSelection.join(', ')
                : 'None selected'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={activeSelection.length === 0}
              onClick={handleConfirm}
              className="px-4 py-2 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              Apply ({activeSelection.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
