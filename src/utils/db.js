const DB_NAME = 'Recepta'
const DB_VERSION = 1
const STORE_IMG = 'plantilla_img'
const STORE_CFG = 'plantilla_cfg'
const CFG_KEY = 'config_v1'

export const CONFIG_DEFAULT = {
  pageWidth: 1122,
  pageHeight: 794,
  fontSize: 14,
  campos: {
    nombre:       { x: 155,  y: 597, size: 28, font: 'regular' },
    edad:         { x: 750,  y: 597, size: 28, font: 'regular' },
    fecha:        { x: 1015, y: 597, size: 28, font: 'regular' },
    prescripcion: { x: 100,  y: 460, size: 22, font: 'italic', lineHeight: 31, maxWidth: 420 },
    indicaciones: { x: 610,  y: 460, size: 22, font: 'italic', lineHeight: 31, maxWidth: 420 },
  },
}

export const FIELD_DEFS = [
  { key: 'nombre',       label: 'Nombre paciente', font: 'regular' },
  { key: 'edad',         label: 'Edad',            font: 'regular' },
  { key: 'fecha',        label: 'Fecha',           font: 'regular' },
  { key: 'prescripcion', label: 'Prescripción',    font: 'italic'  },
  { key: 'indicaciones', label: 'Indicaciones',    font: 'italic'  },
]

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_IMG)) db.createObjectStore(STORE_IMG)
      if (!db.objectStoreNames.contains(STORE_CFG)) db.createObjectStore(STORE_CFG)
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

async function dbSet(store, key, value) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).put(value, key)
    req.onsuccess = () => resolve()
    req.onerror = (e) => reject(e.target.error)
  })
}

async function dbGet(store, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(key)
    req.onsuccess = (e) => resolve(e.target.result ?? null)
    req.onerror = (e) => reject(e.target.error)
  })
}

async function dbDelete(store, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).delete(key)
    req.onsuccess = () => resolve()
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function getPlantillaConfig() {
  const [imgBlob, cfg] = await Promise.all([
    dbGet(STORE_IMG, 'imagen'),
    dbGet(STORE_CFG, CFG_KEY),
  ])
  const imageBytes = imgBlob ? await imgBlob.arrayBuffer() : null
  return { imageBytes, config: cfg ?? CONFIG_DEFAULT }
}

export async function savePlantilla(blob, config) {
  await Promise.all([
    dbSet(STORE_IMG, 'imagen', blob),
    dbSet(STORE_CFG, CFG_KEY, config),
  ])
}

export async function deletePlantilla() {
  await Promise.all([
    dbDelete(STORE_IMG, 'imagen'),
    dbDelete(STORE_CFG, CFG_KEY),
  ])
}
