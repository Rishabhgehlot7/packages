import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class BoostThemeService {
  private modeSubject = new BehaviorSubject<ThemeMode>('system');
  private systemDarkSubject = new BehaviorSubject<boolean>(false);

  mode$: Observable<ThemeMode> = this.modeSubject.asObservable();

  resolvedMode$: Observable<'light' | 'dark'> = combineLatest([
    this.mode$,
    this.systemDarkSubject,
  ]).pipe(
    map(([mode, systemDark]) => mode === 'system' ? (systemDark ? 'dark' : 'light') : mode),
    distinctUntilChanged()
  );

  isDark$: Observable<boolean> = this.resolvedMode$.pipe(map(m => m === 'dark'));

  constructor() {
    const stored = localStorage.getItem('boost-theme') as ThemeMode | null;
    if (stored) this.modeSubject.next(stored);
    this.systemDarkSubject.next(window.matchMedia('(prefers-color-scheme: dark)').matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.systemDarkSubject.next(e.matches);
    });
  }

  setMode(mode: ThemeMode) {
    this.modeSubject.next(mode);
    localStorage.setItem('boost-theme', mode);
  }

  toggle() {
    this.modeSubject.value === 'dark' || (this.modeSubject.value === 'system' && this.systemDarkSubject.value)
      ? this.setMode('light')
      : this.setMode('dark');
  }
}