import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useAuth();

  return (
    <footer>
      <div className="container grid-4">
        <div>
          <h4><i className="fas fa-utensils text-accent"></i> HORECA AFRICA 2026</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.75)' }}>
            Le salon leader B2B de l'Hôtellerie, Restauration & Métiers du Tourisme en Afrique de l'Ouest. Dakar, Sénégal.
          </p>
        </div>
        <div>
          <h4>Navigation Rapide</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Accueil</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('pricing'); }}>Packs & Tarifs</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Matchmaking B2B</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('jobs'); }}>Job Dating RH</a></li>
          </ul>
        </div>
        <div>
          <h4>Profils B2B</h4>
          <ul>
            <li><a href="#">Hôtels & Résidences</a></li>
            <li><a href="#">Restaurants & Cafés</a></li>
            <li><a href="#">Fournisseurs & Équipementiers</a></li>
            <li><a href="#">Investisseurs & Hosted Buyers</a></li>
          </ul>
        </div>
        <div>
          <h4>Infoline & Secrétariat</h4>
          <ul>
            <li><i className="fas fa-phone-alt text-accent"></i> +221 77 542 82 35</li>
            <li><i className="fas fa-envelope text-accent"></i> contact@horecafrica.com</li>
            <li><i className="fas fa-globe text-accent"></i> www.horecafrica.com</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
        © 2026 HORECA AFRICA Business Week Dakar. Tous droits réservés.
      </div>
    </footer>
  );
};
