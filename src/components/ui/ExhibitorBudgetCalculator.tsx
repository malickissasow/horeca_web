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

  const visaCost = useMemo(() => (visaNeeded ? 50000 : 0), [visaNeeded]);

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

  const handleDownloadPDF = () => {
    const originLabel = FLIGHT_OPTIONS.find(o => o.id === origin)?.label || origin;
    const packName = packType === 'stand6' ? 'Stand Découverte 6m²' : packType === 'stand9' ? 'Stand Business 9m²' : packType === 'stand12' ? 'Stand Premium 12m²' : 'Stand Prestige 18m²';
    const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const refNum = `PRO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proforma HORECA AFRICA 2026 - ${refNum}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; background: #fff; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-title { font-size: 24px; font-weight: 900; color: #033498; margin: 0; }
          .subtitle { color: #ea580c; font-size: 14px; font-weight: 700; margin-top: 4px; }
          .ref-block { text-align: right; font-size: 14px; color: #475569; }
          .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          .table th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; color: #334155; border-bottom: 2px solid #cbd5e1; }
          .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .total-box { background: #fff7ed; border: 2px solid #ea580c; padding: 20px; border-radius: 8px; text-align: right; margin-top: 20px; }
          .total-price { font-size: 28px; font-weight: 900; color: #ea580c; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #ea580c; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
            🖨️ Imprimer / Sauvegarder en PDF
          </button>
        </div>
        <div class="header">
          <div>
            <h1 class="logo-title">HORECA AFRICA 2026</h1>
            <div class="subtitle">DEVIS SIMULATION & FACTURE PROFORMA EXPOSANT</div>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">Salon International de l'Hôtellerie & Restauration — Dakar, Sénégal</p>
          </div>
          <div class="ref-block">
            <p style="margin: 0; font-weight: bold; color: #033498;">N° Proforma : ${refNum}</p>
            <p style="margin: 4px 0 0 0;">Date : ${dateStr}</p>
            <p style="margin: 4px 0 0 0;">Dates Salon : 27 & 28 Novembre 2026</p>
          </div>
        </div>

        <h3>Détails du Budget d'Exposition</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Poste de Dépense</th>
              <th>Détails / Options</th>
              <th style="text-align: right;">Montant Estimé (${currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Pack Stand & Exposition</strong></td>
              <td>${packName} (Novotel Dakar)</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(packCost)}</td>
            </tr>
            <tr>
              <td><strong>Vols Aériens A/R</strong></td>
              <td>${teamSize} pers (${originLabel})</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(totalFlightCost)}</td>
            </tr>
            ${hotelType !== 'none' ? `
            <tr>
              <td><strong>Hébergement Hôtel</strong></td>
              <td>${hotelType === 'novotel' ? 'Hôtel Novotel Dakar 4*' : 'Hôtel Partenaire 3*'} (${roomsCount} ch. x ${nightsCount} nuits)</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(totalHotelCost)}</td>
            </tr>` : ''}
            ${logistiqueCost > 0 ? `
            <tr>
              <td><strong>Logistique & Animation Stand</strong></td>
              <td>${highPowerElectric ? 'Électricité renforcée, ' : ''}${kakemonoPrint ? 'Impression Kakemono, ' : ''}${hostessDays > 0 ? `${hostessDays} j. hôtesse` : ''}</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(logistiqueCost)}</td>
            </tr>` : ''}
            ${visaCost > 0 ? `
            <tr>
              <td><strong>Assistance Formalités Visa</strong></td>
              <td>Lettre d'invitation officielle fournie</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(visaCost)}</td>
            </tr>` : ''}
            <tr>
              <td><strong>Per Diem & Transport Local</strong></td>
              <td>Indemnités journalières & taxis (${teamSize} pers.)</td>
              <td style="text-align: right; font-weight: bold;">${formatPrice(totalPerDiem)}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <span style="font-size: 13px; color: #475569; font-weight: bold; text-transform: uppercase;">BUDGET GLOBAL ESTIMÉ PROFORMA</span>
          <div class="total-price">${formatPrice(grandTotalFCFA)}</div>
          <small style="color: #64748b; font-size: 12px;">Prix estimatif sujet aux ajustements de réservation finale.</small>
        </div>

        <div class="footer">
          <p><strong>Comité d'Organisation HORECA AFRICA 2026</strong> | Demba Conciergerie Luxury DMC</p>
          <p>Dakar, Sénégal — Téléphone / WhatsApp : +221 77 542 82 35 | Email : contact@horecafrica.org</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
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
                <span>{t('calcVisa')} — <strong>+{formatPrice(50000)}</strong></span>
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

            {visaCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Assistance Formalités Visa :</span>
                <strong>{formatPrice(visaCost)}</strong>
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
            <button
              onClick={handleDownloadPDF}
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', width: '100%', justifyContent: 'center' }}
            >
              <i className="fas fa-file-pdf text-accent"></i> 📄 Télécharger ma Proforma (PDF)
            </button>

            <a
              href={`https://wa.me/221775428235?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
              style={{ textDecoration: 'none', justifyContent: 'center' }}
            >
              <i className="fab fa-whatsapp"></i> {t('btnSendWA')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
