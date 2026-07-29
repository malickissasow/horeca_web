import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-info">
          <span><i className="fas fa-map-marker-alt"></i> Hôtel Novotel Dakar, Sénégal</span>
          <span><i className="fas fa-calendar"></i> 25 & 26 Novembre 2026</span>
          <span><i className="fas fa-clock"></i> 08h30 - 18h30 GMT</span>
        </div>
        <div className="top-info">
          <span><i className="fas fa-phone-alt"></i> +221 77 542 82 35</span>
          <span><i className="fas fa-envelope"></i> contact@horecafrica.com</span>
        </div>
      </div>
    </div>
  );
};
