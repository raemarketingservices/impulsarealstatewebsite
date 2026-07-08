import { db } from '@/lib/db'

async function main() {
  const settings = [
    // Corporate video
    { key: 'video_url', value: '', label: 'URL del video corporativo (Google Drive o YouTube)', group: 'video' },
    { key: 'video_title', value: 'IMPULSA Real Estate', label: 'Título del video', group: 'video' },
    { key: 'video_subtitle', value: 'Conoce nuestra visión corporativa', label: 'Subtítulo del video', group: 'video' },
    // Trust brands
    { key: 'trust_brands_enabled', value: 'true', label: 'Mostrar sección de marcas/inmobiliarias que confían', group: 'brands' },
    { key: 'trust_brands_title', value: 'Inmobiliarias que confían en nosotros', label: 'Título de la sección', group: 'brands' },
    { key: 'trust_brands_list', value: JSON.stringify(['BHD León', 'Scotiabank', 'Banco Popular', 'APAP', 'Banreservas', 'Asociación La Nacional', 'Cámara RD Bienes Raíces']), label: 'Lista de marcas (JSON array)', group: 'brands' },
  ]
  for (const s of settings) {
    await db.setting.upsert({ where: { key: s.key }, update: { label: s.label, group: s.group }, create: s })
  }
  console.log(`✅ ${settings.length} extra settings seeded`)
}
main().catch(console.error).finally(() => db.$disconnect())
