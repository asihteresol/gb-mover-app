import React, { useState, useEffect } from 'react';
import {
  Bus,
  Calendar,
  Clock,
  User,
  Phone,
  Tag,
  DollarSign,
  Ticket,
  MapPin,
  Sparkles,
  RotateCcw,
  History,
  PhoneCall,
  FileText,
  AlertCircle,
  Armchair,
  CheckCircle,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { TicketData, RoutePreset } from './types/ticket';
import { GBMoversLogo } from './components/GBMoversLogo';
import { TicketModal } from './components/TicketModal';
import { SeatPickerModal } from './components/SeatPickerModal';
import { RecentTicketsList } from './components/RecentTicketsList';

const POPULAR_ROUTES: RoutePreset[] = [
  { from: 'Rawalpindi', to: 'Gilgit', defaultFare: 4200, estimatedHours: '14 hrs' },
  { from: 'Islamabad', to: 'Skardu', defaultFare: 4800, estimatedHours: '16 hrs' },
  { from: 'Rawalpindi', to: 'Hunza', defaultFare: 4500, estimatedHours: '16 hrs' },
  { from: 'Lahore', to: 'Gilgit', defaultFare: 5500, estimatedHours: '19 hrs' },
  { from: 'Gilgit', to: 'Rawalpindi', defaultFare: 4200, estimatedHours: '14 hrs' },
  { from: 'Skardu', to: 'Islamabad', defaultFare: 4800, estimatedHours: '16 hrs' },
];

const BUS_TYPES = [
  'Executive Luxury (2x2)',
  'Super Saloon AC',
  'Business Class Sleeper',
  'Daewoo Luxury Express',
  'Yutong Master AC',
  'Standard AC Coach',
];

const BUS_NAMES = [
  'Gilgit Falcon Express',
  'Karakoram Royal',
  'Hunza Star Cruiser',
  'Skardu Mountain Swift',
  'Silk Route Cruiser',
  'Nagar Express',
];

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'create' | 'recent'>('create');

  // Input states
  const [busType, setBusType] = useState<string>('Executive Luxury (2x2)');
  const [busName, setBusName] = useState<string>('Gilgit Falcon Express');
  const [customBusName, setCustomBusName] = useState<string>('');
  const [seatNumber, setSeatNumber] = useState<string>('14');
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState<string>('08:30 PM');
  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerPhone, setPassengerPhone] = useState<string>('');
  const [passengerCnic, setPassengerCnic] = useState<string>('');
  const [fromCity, setFromCity] = useState<string>('Rawalpindi');
  const [toCity, setToCity] = useState<string>('Gilgit');
  const [fare, setFare] = useState<number>(4200);
  const [discount, setDiscount] = useState<number>(200);

  // Modals
  const [isSeatPickerOpen, setIsSeatPickerOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);

  // Form Validation and Toast
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tickets stored locally
  const [recentTickets, setRecentTickets] = useState<TicketData[]>(() => {
    try {
      const stored = localStorage.getItem('gbmovers_tickets');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Sync tickets with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gbmovers_tickets', JSON.stringify(recentTickets));
    } catch (err) {
      console.error('Failed to save tickets', err);
    }
  }, [recentTickets]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick route select handler
  const handleSelectRoute = (route: RoutePreset) => {
    setFromCity(route.from);
    setToCity(route.to);
    setFare(route.defaultFare);
  };

  // Quick date selector
  const handleSetQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setDepartureDate(d.toISOString().split('T')[0]);
  };

  // Sample data filler
  const handleFillSample = () => {
    setBusType('Executive Luxury (2x2)');
    setBusName('Gilgit Falcon Express');
    setSeatNumber('12');
    setFromCity('Rawalpindi');
    setToCity('Gilgit');
    setDepartureTime('08:30 PM');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartureDate(tomorrow.toISOString().split('T')[0]);
    setPassengerName('Muhammad Asif');
    setPassengerPhone('03120000000');
    setPassengerCnic('71501-1234567-1');
    setFare(4200);
    setDiscount(300);
    setValidationError(null);
    showToast('Sample details loaded');
  };

  // Clear all input fields completely
  const handleClearAllFields = () => {
    setPassengerName('');
    setPassengerPhone('');
    setPassengerCnic('');
    setSeatNumber('');
    setBusType(BUS_TYPES[0]);
    setBusName(BUS_NAMES[0]);
    setCustomBusName('');
    setFromCity('');
    setToCity('');
    setDepartureDate('');
    setDepartureTime('');
    setFare(0);
    setDiscount(0);
    setValidationError(null);
    showToast('All input fields cleared');
  };

  // Reset to standard defaults
  const handleResetDefaults = () => {
    setPassengerName('');
    setPassengerPhone('');
    setPassengerCnic('');
    setSeatNumber('01');
    setFromCity('Rawalpindi');
    setToCity('Gilgit');
    setFare(4200);
    setDiscount(0);
    const today = new Date().toISOString().split('T')[0];
    setDepartureDate(today);
    setDepartureTime('08:30 PM');
    setValidationError(null);
    showToast('Form reset to defaults');
  };

  // Calculated Net Total
  const netTotalFare = Math.max(0, (fare || 0) - (discount || 0));

  // Form submission: Generate 80mm thermal slip & open modal
  const handleGenerateSlip = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passengerName.trim()) {
      setValidationError('Please enter passenger name');
      return;
    }
    if (!seatNumber.trim()) {
      setValidationError('Please select or enter seat number');
      return;
    }
    if (!departureDate) {
      setValidationError('Please select departure date');
      return;
    }
    if (!departureTime) {
      setValidationError('Please enter or select departure time');
      return;
    }
    if (!fromCity.trim() || !toCity.trim()) {
      setValidationError('Please specify departure and arrival stations');
      return;
    }
    if (fare <= 0) {
      setValidationError('Fare must be greater than 0');
      return;
    }

    setValidationError(null);

    // Format departure date
    const dObj = new Date(departureDate);
    const dateFormatted = !isNaN(dObj.getTime())
      ? dObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : departureDate;

    // Generate ticket ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicket: TicketData = {
      id: `GBM-${Date.now()}`,
      ticketNo: `GBM-${randomSuffix}`,
      busType,
      busName: busName === 'Other' ? customBusName || 'GB Express' : busName,
      seatNumber: seatNumber.trim(),
      departureTime,
      departureDate: dateFormatted,
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim() || undefined,
      passengerCnic: passengerCnic.trim() || undefined,
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      fare: Number(fare),
      discount: Number(discount) || 0,
      totalFare: netTotalFare,
      issueDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      issuedBy: 'Booking Counter 01',
      reportingTime: '15 Mins Before Dep.',
      status: 'confirmed',
    };

    // Save to history (latest first)
    setRecentTickets((prev) => [newTicket, ...prev.filter((t) => t.id !== newTicket.id)]);
    setActiveTicket(newTicket);
    setIsTicketModalOpen(true);
  };

  const handleOpenTicket = (t: TicketData) => {
    setActiveTicket(t);
    setIsTicketModalOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setRecentTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast('Ticket removed from history');
  };

  const handleClearAllTickets = () => {
    if (window.confirm('Are you sure you want to delete all saved tickets?')) {
      setRecentTickets([]);
      showToast('All saved tickets deleted');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-20 md:pb-10">
      {/* Top Mobile/Desktop App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <GBMoversLogo size="sm" />

          {/* Quick Helpline Badge */}
          <div className="hidden sm:flex items-center gap-3 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/70 text-xs">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <div className="font-semibold">
              Helpline: <span className="font-mono">0312-0000000</span> · <span className="font-mono">0313-0000000</span>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAllFields}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
              title="Clear all input fields"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden xs:inline">Clear Fields</span>
              <span className="xs:hidden">Clear</span>
            </button>

            <button
              type="button"
              onClick={handleFillSample}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xs:inline">Sample Data</span>
              <span className="xs:hidden">Sample</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {/* Navigation Tabs (Create Ticket vs Recent History) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>New Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('recent')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-blue-600" />
              <span>History ({recentTickets.length})</span>
            </button>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {activeTab === 'create' ? (
          <div className="max-w-3xl mx-auto">
            <div>
              <form
                onSubmit={handleGenerateSlip}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5"
              >
                {/* Popular Route Shortcuts */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Popular Routes
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_ROUTES.map((r) => {
                      const isActive = fromCity === r.from && toCity === r.to;
                      return (
                        <button
                          key={`${r.from}-${r.to}`}
                          type="button"
                          onClick={() => handleSelectRoute(r)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {r.from} ➔ {r.to}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Route: From & To Cities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Departure Station *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      placeholder="e.g. Rawalpindi / Islamabad"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Arrival Destination *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      placeholder="e.g. Gilgit / Skardu / Hunza"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Bus Type & Bus Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bus Type *</span>
                    </label>
                    <select
                      value={busType}
                      onChange={(e) => setBusType(e.target.value)}
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      {BUS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bus Name *</span>
                    </label>
                    <select
                      value={busName}
                      onChange={(e) => setBusName(e.target.value)}
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      {BUS_NAMES.map((bn) => (
                        <option key={bn} value={bn}>
                          {bn}
                        </option>
                      ))}
                      <option value="Other">Other / Custom Name</option>
                    </select>

                    {busName === 'Other' && (
                      <input
                        type="text"
                        value={customBusName}
                        onChange={(e) => setCustomBusName(e.target.value)}
                        placeholder="Enter custom bus name"
                        className="w-full h-10 px-3 mt-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    )}
                  </div>
                </div>

                {/* Seat Number with Visual Map Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Armchair className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Seat Number *</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsSeatPickerOpen(true)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Seat Map</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      placeholder="e.g. 14 or 14, 15"
                      className="flex-1 h-11 px-3 text-sm font-receipt font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setIsSeatPickerOpen(true)}
                      className="h-11 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Armchair className="w-4 h-4" />
                      <span className="hidden sm:inline">Choose Seat</span>
                    </button>
                  </div>

                  {/* Quick Seat Chips */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-1">
                    <span className="text-[11px] text-slate-400 font-medium">Quick Pick:</span>
                    {['01', '04', '08', '14', '15', '21', '25', '32'].map((sn) => (
                      <button
                        key={sn}
                        type="button"
                        onClick={() => setSeatNumber(sn)}
                        className={`text-xs px-2 py-0.5 rounded font-receipt transition-colors cursor-pointer ${
                          seatNumber === sn
                            ? 'bg-slate-900 text-emerald-400 font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Departure Date & Departure Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Departure Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    {/* Quick date shortcuts */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(0)}
                        className="text-slate-600 hover:text-emerald-700 hover:underline"
                      >
                        Today
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(1)}
                        className="text-slate-600 hover:text-emerald-700 hover:underline"
                      >
                        Tomorrow
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(2)}
                        className="text-slate-600 hover:text-emerald-700 hover:underline"
                      >
                        In 2 Days
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Departure Time *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      placeholder="e.g. 08:30 PM"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    {/* Quick time slots */}
                    <div className="flex items-center gap-1 mt-1.5 overflow-x-auto text-[11px]">
                      {['08:00 AM', '02:00 PM', '06:30 PM', '08:30 PM', '11:00 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setDepartureTime(slot)}
                          className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${
                            departureTime === slot
                              ? 'bg-emerald-600 text-white font-semibold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Passenger Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Passenger Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Muhammad Asif"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Phone / WhatsApp</span>
                    </label>
                    <input
                      type="tel"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="e.g. 03120000000"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer CNIC No</span>
                    </label>
                    <input
                      type="text"
                      value={passengerCnic}
                      onChange={(e) => setPassengerCnic(e.target.value)}
                      placeholder="e.g. 71501-1234567-1"
                      className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Fare & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fare (PKR) *</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="50"
                      value={fare || ''}
                      onChange={(e) => setFare(Number(e.target.value))}
                      placeholder="e.g. 4200"
                      className="w-full h-11 px-3 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Discount (PKR)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={discount || ''}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      placeholder="e.g. 200"
                      className="w-full h-11 px-3 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>

                  {/* Calculated Net Total */}
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Net Total Payable:</span>
                      <div className="text-xs text-slate-400">
                        Rs. {(fare || 0).toLocaleString()} - Rs. {(discount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-emerald-700 font-receipt">
                      Rs. {netTotalFare.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons: Generate & Clear */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                   <button
                    type="submit"
                    className="h-13 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-900/15 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllFields}
                    className="h-13 px-5 rounded-2xl border border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-slate-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Clear all fields"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Recent Tickets Tab */
          <RecentTicketsList
            tickets={recentTickets}
            onViewTicket={handleOpenTicket}
            onPrintTicket={(t) => {
              setActiveTicket(t);
              setIsTicketModalOpen(true);
            }}
            onShareTicket={(t) => {
              setActiveTicket(t);
              setIsTicketModalOpen(true);
            }}
            onDeleteTicket={handleDeleteTicket}
            onClearAll={handleClearAllTickets}
          />
        )}
      </main>

      {/* Floating Bottom Action Bar for Mobile Viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              GB
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900">GBMovers</div>
              <div className="text-[9px] text-slate-500">0312-0000000</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'create' ? 'recent' : 'create')}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {activeTab === 'create' ? (
                <>
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </>
              ) : (
                <>
                  <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                  <span>New</span>
                </>
              )}
            </button>

            {activeTab === 'create' && (
              <button
                onClick={handleGenerateSlip}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Seat Picker Modal */}
      <SeatPickerModal
        isOpen={isSeatPickerOpen}
        onClose={() => setIsSeatPickerOpen(false)}
        selectedSeat={seatNumber}
        onSelectSeat={(seat) => setSeatNumber(seat)}
        busType={busType}
      />

      {/* Generated 80mm Thermal Ticket Slip Modal with Print, Share & Download */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={activeTicket}
        onNewBooking={() => {
          handleResetDefaults();
          setActiveTab('create');
        }}
      />
    </div>
  );
}
