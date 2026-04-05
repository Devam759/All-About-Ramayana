import React, { useEffect } from 'react'

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID;
const LEFT_SLOT = import.meta.env.VITE_ADSENSE_LEFT_SLOT_ID;
const RIGHT_SLOT = import.meta.env.VITE_ADSENSE_RIGHT_SLOT_ID;

function AdRail({ side }) {
  const slotId = side === 'left' ? LEFT_SLOT : RIGHT_SLOT;

  useEffect(() => {
    // Skip if using placeholder IDs to avoid 400 errors and console noise
    const isPlaceholder = !ADSENSE_CLIENT || 
                         ADSENSE_CLIENT.includes('1234567890') || 
                         slotId === '1234567890' || 
                         slotId === '0987654321';
    
    if (isPlaceholder) return;

    try {
      const ads = window.adsbygoogle || [];
      ads.push({});
    } catch (err) {
      // Quietly handle errors as they're commonly caused by ad-blockers or re-renders
      if (!err.message?.includes('already have ads')) {
        console.warn('AdSense check:', err.message);
      }
    }
  }, [slotId]);


  return (
    <aside className={`ad-rail ${side}-rail`}>
      <div className="ad-sticky-container">
        <span className="ad-label">Advertisement</span>
        
        {/* Official Google AdSense Tag */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '160px', height: '600px' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format="vertical"
          data-full-width-responsive="false"
        ></ins>

        {/* Development Helper (Visible only if no ad loads) */}
        <div className="ad-debug-info" style={{ fontSize: '0.6rem', opacity: 0.2, marginTop: '5px' }}>
          Slot: {slotId}
        </div>
      </div>
    </aside>
  )
}

export default AdRail
