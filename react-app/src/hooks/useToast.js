import { useState, useRef } from 'react';

export default function useToast() {
  const [toast, setToast] = useState('');
  const timer = useRef(null);
  function showToast(msg) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2800);
  }
  return { toast, showToast };
}
