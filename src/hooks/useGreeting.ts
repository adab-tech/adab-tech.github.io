'use client';

import { useState, useEffect, useRef } from 'react';

export const useGreeting = (greetings: { text: string; lang: string }[]) => {
  const [greeting, setGreeting] = useState(greetings[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % greetings.length;
      setGreeting(greetings[indexRef.current]);
    }, 2500);

    return () => clearInterval(interval);
  }, [greetings]);

  return greeting;
};
