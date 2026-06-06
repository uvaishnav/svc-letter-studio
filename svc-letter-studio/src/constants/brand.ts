export const COLORS = {
  // Browns
  darkBrown:  '#3B2A1F',   // primary brand dark brown
  brown:      '#3B2A1F',   // alias kept for existing usage
  brownLight: '#5C4033',
  brownMuted: '#8B6E5A',
  // Text
  text:       '#2C1F16',   // body copy — slightly darker for readability
  // Ivory
  ivory:      '#F5F1E8',
  ivoryDark:  '#EDE8D8',
  // Gold
  gold:       '#C8A96A',
  goldLight:  '#E8D5A3',
  goldDark:   '#A07840',
  // Utility
  white:      '#FFFFFF',
} as const

export const FONTS = {
  // Web UI fonts (CSS font stacks)
  brand:        "'Cormorant Garamond', Georgia, serif",
  body:         'Montserrat',         // used in @react-pdf/renderer (registered family name)
  bodySemiBold: 'Montserrat-SemiBold', // registered as separate family in fonts.ts
} as const

export const BRAND_NAME_PRIMARY        = 'SRI VAISHNAV'
export const BRAND_NAME_PRIMARY_HEADER = 'Sri Vaishnav'
export const BRAND_NAME_SECONDARY      = 'CONSTRUCTIONS'
export const BRAND_TAGLINE             = 'ENGINEERING  •  INFRASTRUCTURE  •  CIVIL WORKS'

export const CONTACT = {
  phone:   '7989230912',
  email:   'rambabuut@gmail.com',
  address: '2-14, Godavarru, Kankipadu Mandal, Krishna District, Andhra Pradesh – 521151',
  gstin:   '37ADUPU2453N1ZK',
} as const
