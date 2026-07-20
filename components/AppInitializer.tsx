"use client";

import React from 'react';
import { useAppDispatch } from '../store/store';
import { setUser } from '../store/userSlice';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const id = getCookie('userId');
    if (!id) return; // nothing to do

    (async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const body = await res.json();
        if (body?.user) dispatch(setUser(body.user));
      } catch (err) {
        console.warn('Failed to fetch user on init', err);
      }
    })();
  }, [dispatch]);

  return <>{children}</>;
}
