export type SeedAdData = {
  name: string;
  model: string;
  year: number;
  description?: string;
  picture: string;
  ownerEmail: string;
  likes: number;
};

export function getSeedAdDescription(ad: {
  name: string;
  model: string;
  year: number;
}): string {
  return `${ad.year} ${ad.name} ${ad.model} in good condition, suitable for everyday driving. The car has a clean look, practical equipment, and is ready for viewings.`;
}

export const seedAdsData: SeedAdData[] = [
  {
    name: "Ford",
    model: "Focus",
    year: 2012,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2012_Ford_Focus_SE_hatch_front_--_04-19-2011.jpg",
    ownerEmail: "steve@gmail.com",
    likes: 5,
  },
  {
    name: "Toyota",
    model: "Corolla",
    year: 2013,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/%2713_Toyota_Corolla_%28SDLDQ_%2713%29.jpg",
    ownerEmail: "peter@gmail.com",
    likes: 8,
  },
  {
    name: "BMW",
    model: "320d",
    year: 2018,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/BMW_320d.JPG",
    ownerEmail: "john@gmail.com",
    likes: 12,
  },
  {
    name: "Audi",
    model: "A4",
    year: 2017,
    picture:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user1@gmail.com",
    likes: 9,
  },
  {
    name: "Mercedes-Benz",
    model: "C-Class",
    year: 2016,
    picture:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user2@gmail.com",
    likes: 11,
  },
  {
    name: "Volkswagen",
    model: "Golf",
    year: 2015,
    picture:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user3@gmail.com",
    likes: 7,
  },
  {
    name: "Honda",
    model: "Civic",
    year: 2019,
    picture:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user4@gmail.com",
    likes: 14,
  },
  {
    name: "Nissan",
    model: "Qashqai",
    year: 2020,
    picture:
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user5@gmail.com",
    likes: 6,
  },
  {
    name: "Peugeot",
    model: "308",
    year: 2014,
    picture:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user6@gmail.com",
    likes: 4,
  },
  {
    name: "Renault",
    model: "Megane",
    year: 2016,
    picture:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user7@gmail.com",
    likes: 5,
  },
  {
    name: "Skoda",
    model: "Octavia",
    year: 2018,
    picture:
      "https://images.unsplash.com/photo-1523983302122-73e869e1f850?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user8@gmail.com",
    likes: 10,
  },
  {
    name: "Opel",
    model: "Astra",
    year: 2015,
    picture:
      "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user9@gmail.com",
    likes: 3,
  },
  {
    name: "Mazda",
    model: "3",
    year: 2019,
    picture:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "steve@gmail.com",
    likes: 13,
  },
  {
    name: "Kia",
    model: "Sportage",
    year: 2021,
    picture:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "dave@gmail.com",
    likes: 8,
  },
  {
    name: "Hyundai",
    model: "i30",
    year: 2017,
    picture:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "nick@gmail.com",
    likes: 6,
  },
  {
    name: "Seat",
    model: "Leon",
    year: 2016,
    picture:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "john@gmail.com",
    likes: 5,
  },
  {
    name: "Volvo",
    model: "S60",
    year: 2020,
    picture:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "peter@gmail.com",
    likes: 12,
  },
  {
    name: "Fiat",
    model: "Tipo",
    year: 2018,
    picture:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user1@gmail.com",
    likes: 4,
  },
  {
    name: "Citroen",
    model: "C4",
    year: 2017,
    picture:
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user2@gmail.com",
    likes: 4,
  },
  {
    name: "Mini",
    model: "Cooper",
    year: 2019,
    picture:
      "https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user3@gmail.com",
    likes: 15,
  },
  {
    name: "Lexus",
    model: "IS",
    year: 2020,
    picture:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user4@gmail.com",
    likes: 16,
  },
  {
    name: "Subaru",
    model: "Impreza",
    year: 2016,
    picture:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user5@gmail.com",
    likes: 7,
  },
  {
    name: "Tesla",
    model: "Model 3",
    year: 2022,
    picture:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    ownerEmail: "user6@gmail.com",
    likes: 22,
  },
];
