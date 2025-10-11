export const usuarios = [
  {
    id: 1,
    name: "Angie Porras",
    username: "angie_dev",
    email: "angie@example.com",
    city: "Armenia, Quindío",
    joinDate: "2024-01-15",
    imageUrl: "/tomates1.jpg",
    bio: "Amante de la tecnología y la agricultura sostenible 🌱",
    posts: [
      {
        post_id: 1,
        title: "Venta de tomates orgánicos",
        imageUrl: "/tomates1.jpg",
      },
      {
        post_id: 2,
        title: "Venta de lechugas frescas",
        imageUrl: "https://picsum.photos/300?random=20",
      },
      {
        post_id: 3,
        title: "Zanahorias de huerta",
        imageUrl: "https://picsum.photos/300?random=30",
      },
    ],
    purchases: [
      {
        id: 1,
        title: "Aguacates Hass premium",
        sellerName: "Carlos Ramírez",
        date: "2025-09-25",
        price: 45000,
        imageUrl: "https://picsum.photos/300?random=50",
        rating: 0
      },
      {
        id: 2,
        title: "Huevos campesinos orgánicos",
        sellerName: "María González",
        date: "2025-09-20",
        price: 120000,
        imageUrl: "https://picsum.photos/300?random=60",
        rating: 0
      },
      {
        id: 3,
        title: "Plátanos maduros de exportación",
        sellerName: "Juan Pérez",
        date: "2025-09-15",
        price: 85000,
        imageUrl: "https://picsum.photos/300?random=70",
        rating: 0
      }
    ]
  },
];