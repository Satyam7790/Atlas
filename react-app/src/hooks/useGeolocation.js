import { useState } from 'react';

export default function useGeolocation() {
  const [myLocation, setMyLocation] = useState(null);
  const [locating, setLocating]     = useState(false);

  function locate(onSuccess, onError) {
    if (!navigator.geolocation) { onError?.('Geolocation not supported'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMyLocation(coords);
        setLocating(false);
        onSuccess?.(coords);
      },
      () => { setLocating(false); onError?.('Location access denied'); },
      { timeout: 12000 }
    );
  }

  return { myLocation, locating, locate };
}
