import Dexie, { type Table } from 'dexie';
import type { Investigation, Airport, NotebookEntry } from '@/types';

// ============================================================
// IndexedDB service via Dexie — local investigation cache
// ============================================================

export class NtsbDatabase extends Dexie {
  investigations!: Table<Investigation, string>;
  airports!: Table<Airport, string>;
  notebook!: Table<NotebookEntry, string>;
  syncMeta!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('NtsbAviationExplorer');

    this.version(1).stores({
      investigations: 'id, eventDate, *tags, location.stateAbbr, subType, severity, status',
      airports: 'icao, iata, stateAbbr',
      notebook: 'id, investigationId, type, createdAt',
      syncMeta: 'key',
    });
  }
}

export const db = new NtsbDatabase();

/**
 * Seeds the database with the initial investigation dataset.
 * Only runs once; subsequent calls are no-ops.
 */
export async function seedDatabase(investigations: Investigation[], airports: Airport[]): Promise<void> {
  const lastSync = await db.syncMeta.get('lastSync');
  if (lastSync) return; // Already seeded

  await db.transaction('rw', [db.investigations, db.airports, db.syncMeta], async () => {
    await db.investigations.bulkPut(investigations);
    await db.airports.bulkPut(airports);
    await db.syncMeta.put({ key: 'lastSync', value: new Date().toISOString() });
  });
}

/**
 * Retrieves all investigations from local cache.
 */
export async function getAllInvestigations(): Promise<Investigation[]> {
  return db.investigations.toArray();
}

/**
 * Retrieves a single investigation by NTSB ID.
 */
export async function getInvestigationById(id: string): Promise<Investigation | undefined> {
  return db.investigations.get(id);
}

/**
 * Searches investigations by text query using Dexie collection filtering.
 * Full-text search is handled by Fuse.js in the hook layer.
 */
export async function searchInvestigations(query: string): Promise<Investigation[]> {
  const lower = query.toLowerCase();
  return db.investigations
    .filter((inv) => {
      return (
        inv.id.toLowerCase().includes(lower) ||
        inv.location.city.toLowerCase().includes(lower) ||
        inv.location.stateAbbr.toLowerCase().includes(lower) ||
        (inv.location.airport?.toLowerCase().includes(lower) ?? false) ||
        inv.synopsis.toLowerCase().includes(lower) ||
        inv.narrative.toLowerCase().includes(lower) ||
        inv.tags.some((t) => t.toLowerCase().includes(lower))
      );
    })
    .toArray();
}

/**
 * Returns the last synchronization timestamp.
 */
export async function getLastSyncTime(): Promise<string | null> {
  const meta = await db.syncMeta.get('lastSync');
  return meta?.value ?? null;
}
