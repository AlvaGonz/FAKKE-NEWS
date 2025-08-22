<template>
  <div class="ny-logo">
    <div class="logo-icon">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Minimalist typographic design -->
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e23b2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff4757;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background square with rounded corners -->
        <rect x="4" y="4" width="28" height="28" rx="6" fill="url(#logoGradient)" filter="url(#glow)"/>
        
        <!-- Stylized "F" letter -->
        <path d="M10 10 L10 26 L12 26 L12 18 L20 18 L20 16 L12 16 L12 14 L22 14 L22 12 L12 12 L12 10 L24 10 L24 8 L10 8 Z" fill="white"/>
        
        <!-- Decorative elements -->
        <!-- Top accent line -->
        <path d="M8 6 L28 6" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        
        <!-- Bottom accent line -->
        <path d="M8 30 L28 30" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        
      </svg>
    </div>
    <div class="logo-text-container">
      <span class="logo-text">FAKKE</span>
      <span class="logo-subtext">NEWS</span>
    </div>
  </div>
</template>

<style scoped>
.ny-logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-serif);
  font-weight: 900;
  color: var(--text-primary);
  text-decoration: none;
}

.logo-icon {
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(226, 59, 46, 0.3));
  transition: transform 22s ease;
}

.logo-icon:hover {
  transform: scale(2.0) rotate(10440deg);
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  line-height: 1.0;
}

.logo-text {
  background: linear-gradient(135deg, var(--accent), #ff4757);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 900;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
}

.logo-subtext {
  background: linear-gradient(135deg, #2f3542, #57606f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: -2px;
}

@media (max-width: 768px) {
  .ny-logo {
    gap: 0.5rem;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .logo-subtext {
    font-size: 1rem;
  }
  
  .logo-icon svg {
    width: 32px;
    height: 32px;
  }
}
</style>
