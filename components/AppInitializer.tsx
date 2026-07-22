"use client";

import React from 'react';
import { useAppDispatch } from '../store/store';
import { setUser } from '../store/userSlice';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function getStoredUserId() {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem('parkhr.userId');
  if (stored) return stored;
  return getCookie('userId');
}

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // Prefer restoring from localStorage `parkhr.user` for immediate UI population
    try {
      const raw = window.localStorage.getItem('parkhr.user');
      if (raw) {
        const parsed = JSON.parse(raw);
        const safeUser = { ...(parsed || {}) };
        delete safeUser.password;
        delete safeUser.passwd;
        delete safeUser.pwd;
        if (safeUser && Object.keys(safeUser).length > 0) {
          dispatch(setUser(safeUser));
        }
      }
    } catch (err) {
      // ignore parse errors
    }

    const id = getStoredUserId();
    if (!id) return; // nothing more to do

    // Refresh authoritative user data from server in background
    (async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const body = await res.json();
        if (body?.user) {
          dispatch(setUser(body.user));
          if (!getCookie('userId')) {
            document.cookie = `userId=${encodeURIComponent(id)}; Path=/; Max-Age=${60 * 60 * 24 * 30}`;
          }
          try {
            const safeUser: any = { ...(body.user || {}) };
            delete safeUser.password;
            delete safeUser.passwd;
            delete safeUser.pwd;
            window.localStorage.setItem('parkhr.user', JSON.stringify(safeUser));
          } catch (e) {
            // ignore localStorage write errors
          }
        }
      } catch (err) {
        console.warn('Failed to fetch user on init', err);
      }
    })();
  }, [dispatch]);

  return <>{children}</>;
}
