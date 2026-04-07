"use client";

const TILE_CACHE_DB = "chunkloader-map-tile-cache";
const TILE_STORE = "tiles";
const TILE_CACHE_VERSION = "v1";
const TILE_CACHE_ENABLED_KEY = "chunkloader:persistent-map-cache";
const MAX_PERSISTED_TILES = 256;

interface PersistedTileRecord {
  key: string;
  blob: Blob;
  updatedAt: number;
}

let openDbPromise: Promise<IDBDatabase | null> | null = null;

export function loadMapTileCachePreference(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  const stored = window.localStorage.getItem(TILE_CACHE_ENABLED_KEY);
  if (stored === null) {
    window.localStorage.setItem(TILE_CACHE_ENABLED_KEY, "true");
    return true;
  }

  return stored !== "false";
}

export function getPersistentTileKey(key: string): string {
  return `${TILE_CACHE_VERSION}:${key}`;
}

export async function getPersistentRenderTile(key: string): Promise<Blob | null> {
  const db = await openTileCacheDb();
  if (!db) {
    return null;
  }

  const record = await runRequest<PersistedTileRecord | undefined>(
    db.transaction(TILE_STORE, "readonly").objectStore(TILE_STORE).get(getPersistentTileKey(key))
  );

  if (!record) {
    return null;
  }

  void touchPersistentRenderTile(db, record.key);
  return record.blob;
}

export async function setPersistentRenderTile(key: string, blob: Blob): Promise<void> {
  const db = await openTileCacheDb();
  if (!db) {
    return;
  }

  const record: PersistedTileRecord = {
    key: getPersistentTileKey(key),
    blob,
    updatedAt: Date.now(),
  };

  await runRequest(db.transaction(TILE_STORE, "readwrite").objectStore(TILE_STORE).put(record));
  void trimPersistentRenderTiles(db);
}

async function openTileCacheDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") {
    return null;
  }

  if (!openDbPromise) {
    openDbPromise = new Promise((resolve) => {
      const request = indexedDB.open(TILE_CACHE_DB, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.objectStoreNames.contains(TILE_STORE)
          ? request.transaction?.objectStore(TILE_STORE)
          : db.createObjectStore(TILE_STORE, { keyPath: "key" });

        if (store && !store.indexNames.contains("updatedAt")) {
          store.createIndex("updatedAt", "updatedAt");
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    });
  }

  return openDbPromise;
}

async function touchPersistentRenderTile(db: IDBDatabase, key: string): Promise<void> {
  try {
    const tx = db.transaction(TILE_STORE, "readwrite");
    const store = tx.objectStore(TILE_STORE);
    const record = await runRequest<PersistedTileRecord | undefined>(store.get(key));
    if (!record) {
      return;
    }

    record.updatedAt = Date.now();
    await runRequest(store.put(record));
  } catch {
    // Ignore cache touch failures and keep rendering.
  }
}

async function trimPersistentRenderTiles(db: IDBDatabase): Promise<void> {
  try {
    const count = await runRequest<number>(db.transaction(TILE_STORE, "readonly").objectStore(TILE_STORE).count());
    if (count <= MAX_PERSISTED_TILES) {
      return;
    }

    const excess = count - MAX_PERSISTED_TILES;
    const tx = db.transaction(TILE_STORE, "readwrite");
    const store = tx.objectStore(TILE_STORE);
    const index = store.index("updatedAt");
    let removed = 0;

    await new Promise<void>((resolve) => {
      const cursorRequest = index.openCursor();
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor || removed >= excess) {
          resolve();
          return;
        }

        store.delete(cursor.primaryKey);
        removed += 1;
        cursor.continue();
      };
      cursorRequest.onerror = () => resolve();
    });
  } catch {
    // Ignore trimming failures and keep rendering.
  }
}

function runRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
