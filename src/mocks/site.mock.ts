export interface BusinessHour {
  day: string;
  hours: string;
}

export const barberShopMock = {
  name: "Distrito Barber",
  slogan: "Tu estilo. Tu momento.",
  description:
    "Cortes, barba y estilo en un espacio pensado para que salgas sintiéndote mejor que cuando llegaste.",

  heroImage:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85",

  address: "Bella Vista, Tucumán",

  phone: "+54 381 000 0000",

  whatsapp: "+54 381 000 0000",

  whatsappUrl:
    "https://wa.me/543810000000",

  instagram: "@distritobarber",

  instagramUrl:
    "https://instagram.com",

  businessHours: [
    {
      day: "Lunes",
      hours: "09:00 - 18:00",
    },
    {
      day: "Martes",
      hours: "09:00 - 18:00",
    },
    {
      day: "Miércoles",
      hours: "09:00 - 18:00",
    },
    {
      day: "Jueves",
      hours: "09:00 - 18:00",
    },
    {
      day: "Viernes",
      hours: "09:00 - 20:00",
    },
    {
      day: "Sábado",
      hours: "09:00 - 14:00",
    },
    {
      day: "Domingo",
      hours: "Cerrado",
    },
  ] satisfies BusinessHour[],
};