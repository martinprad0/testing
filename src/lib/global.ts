// src/lib/global.ts
import { writable } from 'svelte/store';

import type { Player } from '$lib/types/Player';
export const players = writable<Player[]>([]);

import type { Match } from '$lib/types/Match';
export const matches = writable<Match[]>([]);

