import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { I18nProvider, useI18n } from '../../context/I18nContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>{children}</I18nProvider>
);

// ============================================================
// LANGUE
// ============================================================
describe('I18nContext — langue par défaut', () => {
  it('langue par défaut est "fr"', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.language).toBe('fr');
  });

  it('t("navHome") retourne "Accueil" en français', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('navHome')).toBe('Accueil');
  });

  it('t("venue") retourne le lieu du salon', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('venue')).toContain('Novotel');
  });

  it('t("dates") retourne les dates du salon', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t('dates')).toContain('2026');
  });
});

describe('I18nContext — changement de langue', () => {
  it('setLanguage("en") change la langue vers EN', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
  });

  it('t("navHome") retourne "Home" en anglais', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.t('navHome')).toBe('Home');
  });

  it('t("navPricing") retourne la bonne valeur en anglais', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    const val = result.current.t('navPricing');
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  it('setLanguage("ar") change la langue vers AR', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(result.current.language).toBe('ar');
  });

  it('t() retourne la clé si traduction manquante', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    const val = result.current.t('cle_qui_nexiste_pas_zy9x');
    expect(val).toBe('cle_qui_nexiste_pas_zy9x');
  });

  it('t() fallback sur fr si clé absente en EN', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    // 'venue' is present in fr translations
    const val = result.current.t('venue');
    expect(val.length).toBeGreaterThan(0);
  });
});

// ============================================================
// DEVISE
// ============================================================
describe('I18nContext — devise par défaut', () => {
  it('devise par défaut est "FCFA"', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.currency).toBe('FCFA');
  });

  it('formatPrice(0) retourne "GRATUIT"', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.formatPrice(0)).toBe('GRATUIT');
  });

  it('formatPrice(250000) affiche en FCFA', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const formatted = result.current.formatPrice(250000);
    expect(formatted).toContain('FCFA');
  });
});

describe('I18nContext — changement de devise', () => {
  it('setCurrency("EUR") change la devise', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setCurrency('EUR');
    });

    expect(result.current.currency).toBe('EUR');
  });

  it('formatPrice en EUR affiche le symbole €', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setCurrency('EUR');
    });

    const formatted = result.current.formatPrice(655957);
    expect(formatted).toContain('€');
  });

  it('formatPrice en USD place le symbole avant le montant', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setCurrency('USD');
    });

    const formatted = result.current.formatPrice(600000);
    expect(formatted.startsWith('$')).toBe(true);
  });

  it('setCurrency("DZD") change vers le dinar algérien', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setCurrency('DZD');
    });

    expect(result.current.currency).toBe('DZD');
    const formatted = result.current.formatPrice(100000);
    expect(formatted).toContain('DZD');
  });

  it('convertFromFCFA retourne le bon montant en EUR', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setCurrency('EUR');
    });

    const { amount, symbol } = result.current.convertFromFCFA(655957);
    expect(amount).toBe(1000); // 655957 FCFA ≈ 1000 EUR
    expect(symbol).toBe('€');
  });

});

// ============================================================
// THEME
// ============================================================
describe('I18nContext — thème', () => {
  it('thème initial est "light"', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme change le thème', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('toggleTheme deux fois remet le thème initial', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(initialTheme);
  });


  it('setTheme("dark") force le mode sombre', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('setTheme("light") force le mode clair', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
  });
});

// ============================================================
// HOOK GUARD
// ============================================================
describe('useI18n hors provider', () => {
  it('throw une erreur si utilisé hors I18nProvider', () => {
    expect(() => {
      renderHook(() => useI18n());
    }).toThrow('useI18n must be used within an I18nProvider');
  });
});
