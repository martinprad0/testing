// src/lib/global.ts
import { writable } from 'svelte/store';

import type { Player } from '$lib/types/Player';
export const players = writable<Player[]>([]);