const mockNews = [
  {
    id: 'promo-001',
    title: '¡2x1 en Matrículas!',
    description:
      'Inscríbete con un amigo y paga solo una matrícula durante el mes de diciembre.',
    imageUrl:
      'https://i.ibb.co/v4rQ0Sbf/Gemini-Generated-Image-s3vbebs3vbebs3vb.png',
    type: 'DISCOUNT',
  },
  {
    id: 'event-001',
    title: 'Maratón de Yoga',
    description:
      'Este sábado a las 10:00 AM, únete a nuestra sesión especial de 3 horas de yoga.',
    imageUrl:
      'https://i.ibb.co/ccHVTgqB/Gemini-Generated-Image-gftmj5gftmj5gftm.png" alt="Gemini-Generated-Image-gftmj5gftmj5gftm',
    type: 'EVENT',
  },
  {
    id: 'news-001',
    title: 'Nuevas Máquinas de Cardio',
    description:
      'Hemos renovado nuestra zona de cardio con las últimas cintas y elípticas.',
    imageUrl:
      'https://i.ibb.co/KzSMWrxj/Gemini-Generated-Image-whob2swhob2swhob.png" alt="Gemini-Generated-Image-whob2swhob2swhob',
    type: 'NEWS',
  },
];

export const getNewsAndPromotions = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockNews);
    }, 1200);
  });
};
