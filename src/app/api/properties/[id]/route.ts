import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

// AI-generated interior/exterior photos for the detail gallery
const GALLERY_PHOTOS = [
  '/images/properties/int-living.png',
  '/images/properties/int-kitchen.png',
  '/images/properties/int-bedroom.png',
  '/images/properties/int-bathroom.png',
  '/images/properties/ext-pool.png',
  '/images/properties/ext-terrace.png',
]

// Generate a rich, varied description from property data
function enrichDescription(p: {
  title: string
  description: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  location: string
  city: string
  features: string
  price: number
}): string[] {
  let features: string[] = []
  try { features = JSON.parse(p.features) } catch {}

  const typeLabel: Record<string, string> = {
    VILLA: 'esta exclusiva villa',
    HOUSE: 'esta residencia',
    APARTMENT: 'este apartamento de lujo',
    COMMERCIAL: 'este espacio comercial',
    LAND: 'este terreno',
  }
  const subject = typeLabel[p.type] || 'esta propiedad'

  const paragraphs: string[] = []

  paragraphs.push(
    `${p.title} representa una oportunidad única en el mercado inmobiliario dominicano. ` +
    `Ubicada en ${p.location}, ${p.city}, ${subject} combina arquitectura contemporánea con acabados de primera calidad, ` +
    `ofreciendo un estilo de vida sofisticado en uno de los sectores más codiciados de República Dominicana.`
  )

  const spaces: string[] = []
  if (p.bedrooms > 0) spaces.push(`${p.bedrooms} habitaciones diseñadas para el máximo confort`)
  if (p.bathrooms > 0) spaces.push(`${p.bathrooms} baños con acabados premium`)
  spaces.push(`una distribución inteligente de ${p.area}m²`)
  paragraphs.push(
    `El interior de la propiedad cuenta con ${spaces.join(', ')}, ` +
    `creando ambientes amplios y luminosos que se integran armoniosamente con el entorno tropical. ` +
    `Cada espacio ha sido cuidadosamente planificado para maximizar la ventilación natural, ` +
    `la entrada de luz y la privacidad de sus residentes.`
  )

  if (features.length > 0) {
    paragraphs.push(
      `Entre las amenidades destacadas se incluyen: ${features.slice(0, 6).join(', ')}. ` +
      `Estos elementos elevan la experiencia de vida, proporcionando confort, seguridad y valor de reventa. ` +
      `La propiedad ha sido diseñada pensando tanto en el uso residencial como en su potencial de renta vacacional.`
    )
  }

  paragraphs.push(
    `Con un precio de $${p.price.toLocaleString()} USD, ${subject} representa una excelente oportunidad de inversión ` +
    `en un mercado en crecimiento sostenido. La zona de ${p.city} ha mostrado una apreciación promedio del 8-12% anual, ` +
    `lo que la convierte en una decisión financiera inteligente tanto para uso personal como para generar ingresos pasivos. ` +
    `Nuestro equipo de asesores puede estructurar un plan de financiamiento adaptado a tus necesidades.`
  )

  return paragraphs
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await convexClient.query('functions:getPropertyById', { id })

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 })
    }

    let images: string[] = []
    try { images = JSON.parse(property.images) } catch {}

    const gallery = [
      ...images,
      ...GALLERY_PHOTOS.filter((p) => images.indexOf(p) === -1),
    ].slice(0, 10)

    const enrichedDescription = enrichDescription(property)
    const whatsappNumber = property.whatsappNumber

    return NextResponse.json({
      success: true,
      data: {
        ...property,
        gallery,
        enrichedDescription,
        whatsappNumber,
      },
    })
  } catch (error) {
    console.error('Error fetching property detail:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch property' }, { status: 500 })
  }
}
