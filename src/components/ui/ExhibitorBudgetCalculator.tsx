import React, { useState, useMemo } from 'react';
import { useI18n } from '../../context/I18nContext';

interface FlightOption {
  id: string;
  label: string;
  costPerPerson: number;
}

const FLIGHT_OPTIONS: FlightOption[] = [
  { id: 'algeria', label: '🇩🇿 Algérie (Alger -> Dakar Direct)', costPerPerson: 380000 },
  { id: 'tunisia', label: '🇹🇳 Tunisie (Tunis -> Dakar)', costPerPerson: 420000 },
  { id: 'morocco', label: '🇲🇦 Maroc (Casablanca -> Dakar)', costPerPerson: 320000 },
  { id: 'france', label: '🇫🇷 France / Europe (Paris -> Dakar)', costPerPerson: 450000 },
  { id: 'ci', label: '🇨🇮 Côte d\'Ivoire (Abidjan -> Dakar)', costPerPerson: 250000 },
  { id: 'senegal', label: '🇸🇳 Sénégal (Résident Local)', costPerPerson: 0 },
  { id: 'custom', label: '🌐 Autre / Custom Provenance', costPerPerson: 400000 },
];

export const ExhibitorBudgetCalculator: React.FC = () => {
  const { t, formatPrice, currency } = useI18n();

  // Inputs
  const [packType, setPackType] = useState<'stand6' | 'stand9' | 'stand12' | 'stand18'>('stand6');
  const [teamSize, setTeamSize] = useState<number>(3);
  const [origin, setOrigin] = useState<string>('algeria');
  const [customFlightCost, setCustomFlightCost] = useState<number>(400000);
  
  // Hotel
  const [hotelType, setHotelType] = useState<'novotel' | 'partner' | 'none'>('novotel');
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [nightsCount, setNightsCount] = useState<number>(3);
  
  // Visa & Assistance
  const [visaNeeded, setVisaNeeded] = useState<boolean>(false);
  
  // Animation & Logistique Options
  const [highPowerElectric, setHighPowerElectric] = useState<boolean>(true);
  const [fridgeStorage, setFridgeStorage] = useState<boolean>(false);
  const [kakemonoPrint, setKakemonoPrint] = useState<boolean>(true);
  const [hostessDays, setHostessDays] = useState<number>(0);
  
  // Per Diem
  const [perDiemPerPerson, setPerDiemPerPerson] = useState<number>(20000);

  // Calculations in FCFA (Brochure prices)
  const packCost = useMemo(() => {
    switch (packType) {
      case 'stand6': return 200000;
      case 'stand9': return 350000;
      case 'stand12': return 450000;
      case 'stand18': return 600000;
      default: return 200000;
    }
  }, [packType]);

  const flightCostPerPerson = useMemo(() => {
    if (origin === 'custom') return customFlightCost;
    const opt = FLIGHT_OPTIONS.find(o => o.id === origin);
    return opt ? opt.costPerPerson : 0;
  }, [origin, customFlightCost]);

  const totalFlightCost = useMemo(() => flightCostPerPerson * teamSize, [flightCostPerPerson, teamSize]);

  const hotelCostPerNight = useMemo(() => {
    if (hotelType === 'novotel') return 90000;
    if (hotelType === 'partner') return 55000;
    return 0;
  }, [hotelType]);

  const totalHotelCost = useMemo(() => hotelCostPerNight * roomsCount * nightsCount, [hotelCostPerNight, roomsCount, nightsCount]);

  const visaCost = useMemo(() => (visaNeeded ? 15000 * teamSize : 0), [visaNeeded, teamSize]);

  const logistiqueCost = useMemo(() => {
    let total = 0;
    if (highPowerElectric) total += 35000;
    if (fridgeStorage) total += 40000;
    if (kakemonoPrint) total += 30000;
    total += hostessDays * 25000;
    return total;
  }, [highPowerElectric, fridgeStorage, kakemonoPrint, hostessDays]);

  const totalPerDiem = useMemo(() => perDiemPerPerson * teamSize * (nightsCount || 2), [perDiemPerPerson, teamSize, nightsCount]);

  const grandTotalFCFA = useMemo(() => {
    return packCost + totalFlightCost + totalHotelCost + visaCost + logistiqueCost + totalPerDiem;
  }, [packCost, totalFlightCost, totalHotelCost, visaCost, logistiqueCost, totalPerDiem]);

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    const originLabel = FLIGHT_OPTIONS.find(o => o.id === origin)?.label || origin;
    const packName = packType === 'stand6' ? 'Stand Découverte 6m²' : packType === 'stand9' ? 'Stand Business 9m²' : packType === 'stand12' ? 'Stand Premium 12m²' : 'Stand Prestige 18m²';
    
    const text = `Bonjour Comité HORECA Africa 👋,
Je souhaite valider ma participation (27-28 Nov 2026). Voici notre estimation de budget d'exposition & voyage (${currency}) :

📌 *RECAPITULATIF PROFORMA*
• Formule : ${packName} (${formatPrice(packCost)})
• Équipe : ${teamSize} personne(s)
• Vol/Provenance : ${originLabel} (${formatPrice(totalFlightCost)})
• Hébergement : ${hotelType === 'novotel' ? 'Novotel Dakar 4*' : hotelType === 'partner' ? 'Hôtel Partenaire 3*' : 'Sans hébergement'} (${roomsCount} ch, ${nightsCount} nuits = ${formatPrice(totalHotelCost)})
• Logistique/Animation : ${highPowerElectric ? 'Électricité renforcée (animation), ' : ''}${kakemonoPrint ? 'Kakemono imprimé Dakar, ' : ''}(${formatPrice(logistiqueCost)})
• Visa assistance : ${visaNeeded ? 'Oui' : 'Non / Exemption'}

💰 *BUDGET TOTAL ESTIMÉ* : *${formatPrice(grandTotalFCFA)}*

Pouvez-vous nous envoyer la convention officielle d'exposition ? Merci !`;

    return encodeURIComponent(text);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '2px solid var(--accent)' }}>
      <div className="card-header">
        <h3 className="card-title">
          <i className="fas fa-calculator text-accent"></i> {t('calcTitle')}
        </h3>
        <span className="badge badge-sector">Devise : {currency}</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
        {t('calcSubtitle')}
      </p>

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '30px' }}>
        {/* FORM CONTROLS */}
        <div>
          {/* STEP 1: STAND / PACK */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)' }}>
              {t('calcStep1')} *
            </label>
            <select
              className="form-control"
              value={packType}
              onChange={(e) => setPackType(e.target.value as any)}
              style={{ fontWeight: 700, color: 'var(--primary)' }}
            >
              <option value="stand6">🎪 Stand Découverte 6m² Novotel ({formatPrice(200000)})</option>
              <option value="stand9">💼 Stand Business 9m² Novotel ({formatPrice(350000)})</option>
              <option value="stand12">🏛️ Stand Premium 12m² Novotel ({formatPrice(450000)})</option>
              <option value="stand18">👑 Stand Prestige 18m² Novotel ({formatPrice(600000)})</option>
            </select>
          </div>

          {/* STEP 2: TEAM & ORIGIN */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                {t('calcStep2')} *
              </label>
              <input
                type="number"
                min={1}
                max={15}
                className="form-control"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>ex: 3 personnes (Massinissa &amp; équipe)</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('calcStep3')} *
              </label>
              <select
                className="form-control"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                {FLIGHT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label} — {formatPrice(opt.costPerPerson)}/pers
                  </option>
                ))}
              </select>
            </div>
          </div>

          {origin === 'custom' && (
            <div className="form-group">
              <label className="form-label">Billet d&apos;avion estimé A/R par personne (FCFA)</label>
              <input
                type="number"
                step={10000}
                className="form-control"
                value={customFlightCost}
                onChange={(e) => setCustomFlightCost(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {/* STEP 3: HOTEL & ACCOMMODATION */}
          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)' }}>
              {t('calcStep4')}
            </label>
            <select
              className="form-control"
              value={hotelType}
              onChange={(e) => setHotelType(e.target.value as any)}
            >
              <option value="novotel">🏨 Hôtel Novotel Dakar 4* (Lieu du salon · {formatPrice(90000)}/nuit)</option>
              <option value="partner">🛏️ Hôtel Partenaire 3* ({formatPrice(55000)}/nuit)</option>
              <option value="none">🏠 Sans hébergement (Résidence / Logement Propre)</option>
            </select>
          </div>

          {hotelType !== 'none' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nombre de Chambres</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="form-control"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de Nuits</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="form-control"
                  value={nightsCount}
                  onChange={(e) => setNightsCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: LOGISTICS & ANIMATION */}
          <div style={{ marginTop: '16px', background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
            <label className="form-label" style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
              {t('calcAnimTitle')}
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={highPowerElectric}
                  onChange={(e) => setHighPowerElectric(e.target.checked)}
                />
                <span>{t('calcElectric')} — <strong>+{formatPrice(35000)}</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={fridgeStorage}
                  onChange={(e) => setFridgeStorage(e.target.checked)}
                />
                <span>{t('calcFridge')} — <strong>+{formatPrice(40000)}</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={kakemonoPrint}
                  onChange={(e) => setKakemonoPrint(e.target.checked)}
                />
                <span>{t('calcKakemono')} — <strong>+{formatPrice(30000)}</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={visaNeeded}
                  onChange={(e) => setVisaNeeded(e.target.checked)}
                />
                <span>{t('calcVisa')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* RECAPITULATIF & BUDGET SUMMARY */}
        <div
          style={{
            background: 'var(--primary-dark)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-lg)',
            position: 'sticky',
            top: '100px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '12px' }}>
            <h4 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>
              <i className="fas fa-file-invoice text-accent"></i> Proforma ({currency})
            </h4>
            <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>{currency}</span>
          </div>

          <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pack / Stand :</span>
              <strong>{formatPrice(packCost)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Vols Aériens ({teamSize} pers) :</span>
              <strong>{formatPrice(totalFlightCost)}</strong>
            </div>

            {hotelType !== 'none' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hôtel ({roomsCount} ch. x {nightsCount} nuits) :</span>
                <strong>{formatPrice(totalHotelCost)}</strong>
              </div>
            )}

            {logistiqueCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Logistique &amp; Animation :</span>
                <strong>{formatPrice(logistiqueCost)}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Per diem &amp; Taxis estimé :</span>
              <strong>{formatPrice(totalPerDiem)}</strong>
            </div>
          </div>

          {/* TOTAL DISPLAY */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '1.5px solid rgba(243, 103, 29, 0.5)',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
              {t('calcGrandTotal')} ({currency})
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1.1, margin: '6px 0' }}>
              {formatPrice(grandTotalFCFA)}
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`https://wa.me/221775428235?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
              style={{ textDecoration: 'none', justifyContent: 'center' }}
            >
              <i className="fab fa-whatsapp"></i> {t('btnSendWA')}
            </a>

            {/* <button
              onClick={handlePrint}
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', width: '100%', justifyContent: 'center' }}
            >
              <i className="fas fa-print"></i> {t('btnPrintProforma')}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
