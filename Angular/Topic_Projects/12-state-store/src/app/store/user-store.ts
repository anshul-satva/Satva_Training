import { computed, Injectable, signal } from '@angular/core';

interface UserI {
  name: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  user = signal<UserI | null>(null);
  isLogin = computed(() => this.user() !== null);

  isAdmin = computed(() => this.user()?.role === 'admin');

  login(name: string, role: 'user' | 'admin') {
    this.user.set({ name, role });
  }

  logout() {
    this.user.set(null);
  }
}
