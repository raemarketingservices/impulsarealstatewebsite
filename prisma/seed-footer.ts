import { db } from '@/lib/db'

async function main() {
  const settings = [
    { key: 'footer_copyright', value: '© 2026 IMPULSA Real Estate. Todos los derechos reservados.', label: 'Texto de copyright del footer', group: 'footer' },
    { key: 'footer_description', value: 'La plataforma inmobiliaria corporativa líder en República Dominicana. Invertir en bienes raíces nunca fue tan transparente.', label: 'Descripción de marca en el footer', group: 'footer' },
  ]
  for (const s of settings) {
    await db.setting.upsert({ where: { key: s.key }, update: { label: s.label, group: s.group }, create: s })
  }
  // Update address to new location
  await db.setting.upsert({ where: { key: 'address' }, update: { value: 'Bella Terra Mall, 3er nivel Av. Juan Pablo Duarte 4, Santiago de los Caballeros 51000' }, create: { key: 'address', value: 'Bella Terra Mall, 3er nivel Av. Juan Pablo Duarte 4, Santiago de los Caballeros 51000', label: 'Dirección', group: 'contact' } })
  console.log('✅ Footer settings seeded + address updated')
}
main().catch(console.error).finally(() => db.$disconnect())
