const mockNews = [
  {
    id: "promo-001",
    title: "¡2x1 en Matrículas!",
    description:
      "Inscríbete con un amigo y paga solo una matrícula durante el mes de diciembre.",
    imageUrl: "https://picsum.photos/seed/gympromo1/700",
    type: "DISCOUNT",
  },
  {
    id: "event-001",
    title: "Maratón de Yoga",
    description:
      "Este sábado a las 10:00 AM, únete a nuestra sesión especial de 3 horas de yoga.",
    imageUrl: "https://picsum.photos/seed/gymevent1/700",
    type: "EVENT",
  },
  {
    id: "news-001",
    title: "Nuevas Máquinas de Cardio",
    description:
      "Hemos renovado nuestra zona de cardio con las últimas cintas y elípticas.",
    imageUrl: "https://picsum.photos/seed/gymnews1/700",
    type: "NEWS",
  },
];

export const getNewsAndPromotions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNews);
    }, 1200);
  });
};