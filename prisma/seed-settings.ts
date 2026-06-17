import { db } from '@/lib/db'

async function main() {
  console.log('🌱 Seeding settings...')

  const settings = [
    // WhatsApp numbers (editable from admin)
    { key: 'whatsapp_general', value: '18095550100', label: 'WhatsApp General (Empresa)', group: 'whatsapp' },
    { key: 'whatsapp_carlos', value: '18095550101', label: 'WhatsApp Carlos Méndez', group: 'whatsapp' },
    { key: 'whatsapp_isabel', value: '18095550102', label: 'WhatsApp Isabel Rodríguez', group: 'whatsapp' },
    { key: 'whatsapp_miguel', value: '18095550103', label: 'WhatsApp Miguel Fernández', group: 'whatsapp' },
    { key: 'whatsapp_laura', value: '18095550104', label: 'WhatsApp Laura Castellanos', group: 'whatsapp' },
    // Contact
    { key: 'phone_general', value: '+1 809-555-0100', label: 'Teléfono General', group: 'contact' },
    { key: 'email_general', value: 'info@impulsarealestate.com', label: 'Email General', group: 'contact' },
    { key: 'address', value: 'Av. Winston Churchill 1099, Piantini, Santo Domingo', label: 'Dirección', group: 'contact' },
    // Social links
    { key: 'instagram', value: 'https://instagram.com/impulsarealestate', label: 'Instagram', group: 'social' },
    { key: 'tiktok', value: 'https://tiktok.com/@impulsarealestate', label: 'TikTok', group: 'social' },
    { key: 'facebook', value: 'https://facebook.com/impulsarealestate', label: 'Facebook', group: 'social' },
  ]

  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { label: s.label, group: s.group },
      create: s,
    })
  }

  console.log(`✅ ${settings.length} settings seeded`)
}

main().catch(console.error).finally(() => db.$disconnect())
