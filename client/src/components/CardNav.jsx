import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './CardNav.css';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  baseColor = '#fff',
  menuColor = '#000',
  buttonBgColor = '#111',
  buttonTextColor = '#fff',
  ctaLabel = 'Get Started',
  ctaTo = '/',
  onCtaClick,
  theme = 'light',
  onThemeChange,
}) => {
  const [open, setOpen] = useState(false);

  const navHeight = useMemo(() => (open ? 260 : 60), [open]);

  return (
    <div className="card-nav-container">
      <div className={`card-nav ${open ? 'open' : ''}`} style={{ height: navHeight, backgroundColor: baseColor }}>
        <div className="card-nav-top" style={{ color: menuColor }}>
          <div className={`hamburger-menu ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          {/* <div className="logo-container">
            {logo ? <img  alt={logoAlt} className="logo" /> : null}
          </div> */}

          <div className="card-nav-actions">
            {ctaLabel && (
              <Link
                to={ctaTo}
                className="card-nav-cta-button"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                onClick={onCtaClick}
              >
                {ctaLabel}
              </Link>
            )}
            <div className="card-nav-theme">
              <label htmlFor="theme-select" className="sr-only">Theme</label>
              <select
                id="theme-select"
                className="card-nav-theme-select"
                value={theme}
                onChange={(e) => onThemeChange?.(e.target.value)}
                aria-label="Theme"
              >
                <option value="light">Light</option>
                <option value="neon">Fluor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-nav-content">
          {items.map((item) => (
            <div
              key={item.label}
              className="nav-card"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((link) => (
                  link.to ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="nav-card-link"
                      aria-label={link.ariaLabel}
                      onClick={link.onClick}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      className="nav-card-link"
                      aria-label={link.ariaLabel}
                      onClick={link.onClick}
                      type="button"
                    >
                      {link.label}
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardNav;
