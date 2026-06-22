import { db } from '@/lib/db'

// Curated high-quality Unsplash images (stable, reliable CDN)
const IMG = {
  // Luxury properties
  villa1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  villa2: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
  villa3: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  apt1: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  apt2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
  apt3: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
  penthouse: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
  beach: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  modern: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  condo: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  // Interiors / lifestyle
  int1: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  int2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  int3: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
  int4: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
  pool: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
  // Agents
  agent1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
  agent2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  agent3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
  agent4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  agent5: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
  agent6: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  // Clients
  client1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  client2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  client3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  client4: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
}

async function main() {
  console.log('🌱 Seeding IMPULSA Real Estate database...')

  // Clear existing data
  await db.socialPost.deleteMany()
  await db.inquiry.deleteMany()
  await db.goal.deleteMany()
  await db.property.deleteMany()
  await db.agent.deleteMany()
  await db.testimonial.deleteMany()
  await db.user.deleteMany()

  // --- Agents ---
  const agents = await Promise.all([
    db.agent.create({
      data: {
        name: 'Carlos Méndez',
        title: 'Director de Ventas & Asesor Senior',
        bio: 'Más de 15 años de experiencia en el mercado inmobiliario de lujo en República Dominicana. Especialista en propiedades de alta gama en Santo Domingo y la zona este. Ha cerrado más de 300 transacciones exitosas.',
        photoUrl: IMG.agent1,
        phone: '+1 809-555-0101',
        email: 'carlos.mendez@impulsarealestate.com',
        whatsapp: '18095550101',
        instagram: 'carlosmendez.realestate',
        specialties: JSON.stringify(['Propiedades de Lujo', 'Santo Domingo', 'Casas de Playa']),
        rating: 4.9,
        salesCount: 312,
        order: 1,
      },
    }),
    db.agent.create({
      data: {
        name: 'Isabel Rodríguez',
        title: 'Asesora Inmobiliaria & Especialista en Inversión',
        bio: 'Economista con maestría en finanzas inmobiliarias. Experta en estructuración de inversiones y análisis de rentabilidad para inversionistas extranjeros. Certificada por la Cámara Dominicana de Bienes Raíces.',
        photoUrl: IMG.agent2,
        phone: '+1 809-555-0102',
        email: 'isabel.rodriguez@impulsarealestate.com',
        whatsapp: '18095550102',
        instagram: 'isabel.invest.realestate',
        specialties: JSON.stringify(['Análisis de Inversión', 'Punta Cana', 'Apartamentos']),
        rating: 5.0,
        salesCount: 198,
        order: 2,
      },
    }),
    db.agent.create({
      data: {
        name: 'Miguel Fernández',
        title: 'Asesor Comercial & Especialista en Financiamiento',
        bio: 'Especialista en financiamiento hipotecario y asesoría crediticia. Conecta a nuestros clientes con las mejores opciones de bancos locales e internacionales. Ha facilitado más de $50M en préstamos hipotecarios.',
        photoUrl: IMG.agent4,
        phone: '+1 809-555-0103',
        email: 'miguel.fernandez@impulsarealestate.com',
        whatsapp: '18095550103',
        specialties: JSON.stringify(['Financiamiento Hipotecario', 'Primer Hogar', 'Santiago']),
        rating: 4.8,
        salesCount: 156,
        order: 3,
      },
    }),
    db.agent.create({
      data: {
        name: 'Laura Castellanos',
        title: 'Asesora de Propiedades Premium & Relaciones Públicas',
        bio: 'Comunicadora con especialización en marketing inmobiliario. Maneja nuestra cartera de clientes corporativos y embajadas. Experta en propiedades ejecutivas y comerciales en el Gran Santo Domingo.',
        photoUrl: IMG.agent5,
        phone: '+1 809-555-0104',
        email: 'laura.castellanos@impulsarealestate.com',
        whatsapp: '18095550104',
        instagram: 'laura.premium.realestate',
        specialties: JSON.stringify(['Propiedades Ejecutivas', 'Comercial', 'Piantini']),
        rating: 4.9,
        salesCount: 143,
        order: 4,
      },
    }),
  ])

  // --- Properties ---
  const properties = [
    {
      title: 'Villa Mediterránea con Vista al Mar',
      description: 'Exquisita villa de lujo en Cap Cana con 5 habitaciones, piscina infinita, acceso privado a la playa y acabados de primera calidad. Diseño mediterráneo contemporáneo con amplios espacios abiertos.',
      type: 'VILLA',
      price: 1850000,
      bedrooms: 5,
      bathrooms: 6,
      area: 620,
      parking: 4,
      location: 'Cap Cana',
      city: 'Punta Cana',
      zone: 'Este',
      images: JSON.stringify([IMG.villa1, IMG.pool, IMG.int1]),
      features: JSON.stringify(['Piscina infinita', 'Acceso a playa', 'Smart home', 'Cocina gourmet', 'Jardín tropical', 'Garaje para 4 autos']),
      featured: true,
      agentId: agents[0].id,
    },
    {
      title: 'Penthouse Ejecutivo en Piantini',
      description: 'Espectacular penthouse de 4 niveles en el corazón financiero de Santo Domingo. Vista panorámica de 360°, terraza privada con jacuzzi y acceso a amenities de edificio premium.',
      type: 'APARTMENT',
      price: 685000,
      bedrooms: 3,
      bathrooms: 4,
      area: 280,
      parking: 3,
      location: 'Torre Piantini',
      city: 'Santo Domingo',
      zone: 'Nacional',
      images: JSON.stringify([IMG.penthouse, IMG.int2, IMG.modern]),
      features: JSON.stringify(['Vista 360°', 'Jacuzzi privado', 'Gym', 'Concierge 24/7', 'Doble altura']),
      featured: true,
      agentId: agents[3].id,
    },
    {
      title: 'Casa Moderna en Casa de Campo',
      description: 'Residencia contemporánea en el exclusivo resort Casa de Campo. Diseño minimalista con materiales nobles, piscina privada y vista al campo de golf.',
      type: 'HOUSE',
      price: 1250000,
      bedrooms: 4,
      bathrooms: 5,
      area: 450,
      parking: 3,
      location: 'Casa de Campo',
      city: 'La Romana',
      zone: 'Este',
      images: JSON.stringify([IMG.villa2, IMG.int3, IMG.pool]),
      features: JSON.stringify(['Vista al golf', 'Piscina privada', 'Cocina abierta', 'Terraza', 'Casa de servicio']),
      featured: true,
      agentId: agents[0].id,
    },
    {
      title: 'Apartamento de Lujo en Blue Mall',
      description: 'Apartamento de alta gama en Blue Mall Tower con acceso directo al centro comercial. Acabados importados, cocina italiana y sistema de domótica.',
      type: 'APARTMENT',
      price: 420000,
      bedrooms: 2,
      bathrooms: 2,
      area: 165,
      parking: 2,
      location: 'Blue Mall Tower',
      city: 'Santo Domingo',
      zone: 'Nacional',
      images: JSON.stringify([IMG.apt1, IMG.int4, IMG.modern]),
      features: JSON.stringify(['Domótica', 'Acceso a mall', 'Piscina de edificio', 'Gym', 'Sky lounge']),
      featured: true,
      agentId: agents[3].id,
    },
    {
      title: 'Villa de Playa en Las Terrenas',
      description: 'Paraíso tropical en la costa de Las Terrenas. Villa con arquitectura tropical dominicana, frente a la playa, ideal para renta vacacional o residencia.',
      type: 'VILLA',
      price: 890000,
      bedrooms: 4,
      bathrooms: 4,
      area: 380,
      parking: 2,
      location: 'Las Terrenas',
      city: 'Las Terrenas',
      zone: 'Noreste',
      images: JSON.stringify([IMG.beach, IMG.villa3, IMG.int1]),
      features: JSON.stringify(['Frente de playa', 'Renta vacacional', 'Coco palms', 'Piscina', 'Bodega de vinos']),
      featured: true,
      agentId: agents[1].id,
    },
    {
      title: 'Penthouse con Terraza Panorámica',
      description: 'Ático de dos niveles con terraza de 80m², baño de vapor y vista al mar. En edificio boutique de solo 8 unidades.',
      type: 'APARTMENT',
      price: 540000,
      bedrooms: 3,
      bathrooms: 3,
      area: 210,
      parking: 2,
      location: 'Bavaro',
      city: 'Punta Cana',
      zone: 'Este',
      images: JSON.stringify([IMG.apt2, IMG.int2, IMG.pool]),
      features: JSON.stringify(['Terraza 80m²', 'Baño de vapor', 'Edificio boutique', 'Vista al mar']),
      featured: true,
      agentId: agents[1].id,
    },
    {
      title: 'Mansión Contemporánea en Arroyo Hondo',
      description: 'Imponente residencia de 700m² en sector exclusivo. 6 habitaciones, cine, gym, piscina olímpica y cancha de tennis.',
      type: 'HOUSE',
      price: 2150000,
      bedrooms: 6,
      bathrooms: 7,
      area: 700,
      parking: 6,
      location: 'Arroyo Hondo',
      city: 'Santiago',
      zone: 'Norte',
      images: JSON.stringify([IMG.modern, IMG.villa1, IMG.int3]),
      features: JSON.stringify(['Cine', 'Gym', 'Piscina olímpica', 'Cancha de tennis', 'Casa de servicio', 'Bodega']),
      featured: true,
      agentId: agents[2].id,
    },
    {
      title: 'Loft Industrial en Zona Colonial',
      description: 'Loft de diseño en patrimonio histórico. Vigas expuestas, concreto pulido y mobiliario de diseñador. Ideal para profesional ejecutivo.',
      type: 'APARTMENT',
      price: 285000,
      bedrooms: 1,
      bathrooms: 2,
      area: 120,
      parking: 1,
      location: 'Zona Colonial',
      city: 'Santo Domingo',
      zone: 'Nacional',
      images: JSON.stringify([IMG.apt3, IMG.int4, IMG.condo]),
      features: JSON.stringify(['Diseño industrial', 'Patrimonio histórico', 'Doble altura', 'Terraza']),
      featured: false,
      agentId: agents[3].id,
    },
  ]

  for (const p of properties) {
    await db.property.create({ data: p })
  }

  // --- Testimonials ---
  const testimonials = [
    {
      clientName: 'Roberto Acevedo',
      clientRole: 'Inversionista, Ciudad de México',
      clientPhoto: IMG.client1,
      message: 'IMPULSA Real Estate transformó mi forma de invertir. El equipo me guió en la compra de dos propiedades en Punta Cana con un retorno del 18% anual. Su dashboard de metas me mantiene enfocado en mis objetivos.',
      rating: 5,
      property: 'Villa de Playa en Las Terrenas',
      order: 1,
    },
    {
      clientName: 'María González',
      clientRole: 'Empresaria, Santo Domingo',
      clientPhoto: IMG.client2,
      message: 'La profesionalidad de Isabel y su equipo es excepcional. Encontré mi apartamento de ensueño en Piantini y el financiamiento fue un proceso transparente y sin estrés. La calculadora hipotecaria me ayudó a planificar todo.',
      rating: 5,
      property: 'Penthouse Ejecutivo en Piantini',
      order: 2,
    },
    {
      clientName: 'James Patterson',
      clientRole: 'Investor, New York',
      clientPhoto: IMG.client3,
      message: 'As a foreign investor, I was nervous about buying property in the Dominican Republic. IMPULSA made the entire process seamless. Their market analysis and financial projections gave me confidence. Excellent service.',
      rating: 5,
      property: 'Casa Moderna en Casa de Campo',
      order: 3,
    },
    {
      clientName: 'Carmen Vásquez',
      clientRole: 'Médica Especialista, Santiago',
      clientPhoto: IMG.client4,
      message: 'Miguel fue clave para conseguir el mejor financiamiento hipotecario. Su asesoría sobre metas de ahorro me permitió comprar mi primera propiedad sin comprometer mi estilo de vida. Recomiendo IMPULSA al 100%.',
      rating: 5,
      property: 'Mansión Contemporánea en Arroyo Hondo',
      order: 4,
    },
  ]

  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  // --- Social Posts ---
  const socialPosts = [
    { platform: 'INSTAGRAM', caption: 'Vista al amanecer desde nuestro nuevo listing en Cap Cana 🌅✨', imageUrl: IMG.villa1, likes: 1243, comments: 89, order: 1 },
    { platform: 'TIKTOK', caption: 'Tour completo de este penthouse en Piantini 🏙️ #RealEstateRD', imageUrl: IMG.penthouse, likes: 5621, comments: 312, order: 2 },
    { platform: 'INSTAGRAM', caption: 'El detalle hace la diferencia. Acabados de lujo en cada rincón ✨', imageUrl: IMG.int1, likes: 892, comments: 45, order: 3 },
    { platform: 'FACEBOOK', caption: '¡Felicitaciones a nuestros clientes por su nuevo hogar en Casa de Campo!', imageUrl: IMG.villa2, likes: 445, comments: 67, order: 4 },
    { platform: 'INSTAGRAM', caption: 'Diseño contemporáneo que redefine el lujo dominicano 🌴', imageUrl: IMG.modern, likes: 1567, comments: 102, order: 5 },
    { platform: 'TIKTOK', caption: 'Antes y después: transformación total de esta villa 🏗️→🏡', imageUrl: IMG.beach, likes: 8900, comments: 543, order: 6 },
    { platform: 'INSTAGRAM', caption: 'La cocina de tus sueños existe y la tenemos 🍳✨', imageUrl: IMG.int3, likes: 1102, comments: 78, order: 7 },
    { platform: 'FACEBOOK', caption: 'Inversión inmobiliaria en RD: el momento es ahora 📈', imageUrl: IMG.condo, likes: 678, comments: 91, order: 8 },
  ]

  for (const s of socialPosts) {
    await db.socialPost.create({ data: s })
  }

  // --- Demo User + Goals ---
  const demoUser = await db.user.create({
    data: {
      email: 'cliente@impulsarealestate.com',
      name: 'Cliente Demo',
      phone: '+1 809-555-0000',
      role: 'CLIENT',
    },
  })

  await db.goal.create({
    data: {
      userId: demoUser.id,
      title: 'Enganche para apartamento en Piantini',
      type: 'SAVINGS',
      targetAmount: 140000,
      currentAmount: 87500,
      targetDate: new Date('2025-12-31'),
      status: 'ACTIVE',
    },
  })

  await db.goal.create({
    data: {
      userId: demoUser.id,
      title: 'Fondo de inversión inmobiliaria',
      type: 'INVESTMENT',
      targetAmount: 500000,
      currentAmount: 215000,
      targetDate: new Date('2027-06-30'),
      status: 'ACTIVE',
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`   - ${agents.length} agents`)
  console.log(`   - ${properties.length} properties`)
  console.log(`   - ${testimonials.length} testimonials`)
  console.log(`   - ${socialPosts.length} social posts`)
  console.log(`   - 2 goals for demo user`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
