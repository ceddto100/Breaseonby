const AD_SIZES = {
  leaderboard: { width: 728, height: 90, label: '728x90' },
  rectangle: { width: 300, height: 250, label: '300x250' },
  skyscraper: { width: 160, height: 600, label: '160x600' },
};

const AD_SLOTS = {
  leaderboard: import.meta.env.VITE_AD_SLOT_LEADERBOARD || '',
  rectangle: import.meta.env.VITE_AD_SLOT_RECTANGLE || '',
  skyscraper: import.meta.env.VITE_AD_SLOT_SKYSCRAPER || '',
};

export default function AdUnit({ size = 'leaderboard', className = '' }) {
  const { width, height, label } = AD_SIZES[size] || AD_SIZES.leaderboard;
  const adClient = import.meta.env.VITE_ADSENSE_CLIENT || '';
  const adSlot = AD_SLOTS[size] || '';

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <div
        className="ad-unit"
        style={{
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <span className="text-gray-600 text-xs font-mono">AD — {label}</span>
      </div>
    </div>
  );
}
