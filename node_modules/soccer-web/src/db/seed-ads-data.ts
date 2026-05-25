export type SeedAdData = {
  name: string;
  model: string;
  year: number;
  price?: number;
  description?: string;
  picture: string;
  ownerEmail: string;
  likes: number;
};

function commonsFilePath(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

export function getSeedAdDescription(ad: {
  name: string;
  model: string;
  year: number;
}): string {
  return `${ad.year} ${ad.name} ${ad.model} in good condition, suitable for everyday driving. The car has a clean look, practical equipment, and is ready for viewings.`;
}

export function getSeedAdPrice(ad: { year: number; likes: number }): number {
  const age = Math.max(new Date().getFullYear() - ad.year, 0);
  const basePrice = Math.max(42000 - age * 1800, 3500);

  return basePrice + ad.likes * 250;
}

export const seedAdsData: SeedAdData[] = [
  {
    name: "Ford",
    model: "Focus",
    year: 2012,
    picture: commonsFilePath("2012 Ford Focus SE hatch front -- 04-19-2011.jpg"),
    ownerEmail: "steve@gmail.com",
    likes: 5,
  },
  {
    name: "Toyota",
    model: "Corolla",
    year: 2013,
    picture: commonsFilePath("'13 Toyota Corolla (SDLDQ '13).jpg"),
    ownerEmail: "peter@gmail.com",
    likes: 8,
  },
  {
    name: "BMW",
    model: "320d",
    year: 2018,
    picture: commonsFilePath("BMW 320d (F30) en Valencia 01.jpg"),
    ownerEmail: "john@gmail.com",
    likes: 12,
  },
  {
    name: "Audi",
    model: "A4",
    year: 2017,
    picture: commonsFilePath(
      "2017 Audi A4 (8W) S-Line quattro sedan (2018-03-22) 02.jpg",
    ),
    ownerEmail: "user1@gmail.com",
    likes: 9,
  },
  {
    name: "Mercedes-Benz",
    model: "C-Class",
    year: 2016,
    picture: commonsFilePath("2016 Mercedes-Benz C220 Sport Premium 2.1 Front.jpg"),
    ownerEmail: "user2@gmail.com",
    likes: 11,
  },
  {
    name: "Volkswagen",
    model: "Golf",
    year: 2015,
    picture: commonsFilePath("2015 Volkswagen Golf, Front Right, 08-05-2020.jpg"),
    ownerEmail: "user3@gmail.com",
    likes: 7,
  },
  {
    name: "Honda",
    model: "Civic",
    year: 2019,
    picture: commonsFilePath("2019 Honda Civic LX Sedan.jpg"),
    ownerEmail: "user4@gmail.com",
    likes: 14,
  },
  {
    name: "Nissan",
    model: "Qashqai",
    year: 2020,
    picture: commonsFilePath("Nissan Qashqai J11 22.09.20 JM.jpg"),
    ownerEmail: "user5@gmail.com",
    likes: 6,
  },
  {
    name: "Peugeot",
    model: "308",
    year: 2014,
    picture: commonsFilePath(
      "Peugeot 308 82 VTi Active (II) – Frontansicht, 4. Januar 2014, Düsseldorf.jpg",
    ),
    ownerEmail: "user6@gmail.com",
    likes: 4,
  },
  {
    name: "Renault",
    model: "Megane",
    year: 2016,
    picture: commonsFilePath("2016 Renault Megane IV fl.jpg"),
    ownerEmail: "user7@gmail.com",
    likes: 5,
  },
  {
    name: "Skoda",
    model: "Octavia",
    year: 2018,
    picture: commonsFilePath(
      "2018 Skoda Octavia (5E MY18.5) 110TSI station wagon (2018-08-27) 01.jpg",
    ),
    ownerEmail: "user8@gmail.com",
    likes: 10,
  },
  {
    name: "Opel",
    model: "Astra",
    year: 2015,
    picture: commonsFilePath("2015 Opel Astra (23069552133).jpg"),
    ownerEmail: "user9@gmail.com",
    likes: 3,
  },
  {
    name: "Mazda",
    model: "3",
    year: 2019,
    picture: commonsFilePath("2019 Mazda3, Front Right, 10-07-2020.jpg"),
    ownerEmail: "steve@gmail.com",
    likes: 13,
  },
  {
    name: "Kia",
    model: "Sportage",
    year: 2021,
    picture: commonsFilePath(
      "2021 Kia Sportage LX AWD in Snow White Pearl, front left, 2025-07-06.jpg",
    ),
    ownerEmail: "dave@gmail.com",
    likes: 8,
  },
  {
    name: "Hyundai",
    model: "i30",
    year: 2017,
    picture: commonsFilePath("Hyundai i30 Active, 2017 front.jpg"),
    ownerEmail: "nick@gmail.com",
    likes: 6,
  },
  {
    name: "Seat",
    model: "Leon",
    year: 2016,
    picture: commonsFilePath("2016 SEAT Leon SE Dynamic Technology 1.2.jpg"),
    ownerEmail: "john@gmail.com",
    likes: 5,
  },
  {
    name: "Volvo",
    model: "S60",
    year: 2020,
    picture: commonsFilePath("2020 Volvo S60 T8 Twin Engine AWD R-Design.jpg"),
    ownerEmail: "peter@gmail.com",
    likes: 12,
  },
  {
    name: "Fiat",
    model: "Tipo",
    year: 2018,
    picture: commonsFilePath("2018 Fiat Tipo Easy 1.4 Front.jpg"),
    ownerEmail: "user1@gmail.com",
    likes: 4,
  },
  {
    name: "Citroen",
    model: "C4",
    year: 2017,
    picture: commonsFilePath("Citroën C4 front.jpg"),
    ownerEmail: "user2@gmail.com",
    likes: 4,
  },
  {
    name: "Mini",
    model: "Cooper",
    year: 2019,
    picture: commonsFilePath("2019 Mini Cooper Exclusive 1.5 Front.jpg"),
    ownerEmail: "user3@gmail.com",
    likes: 15,
  },
  {
    name: "Lexus",
    model: "IS",
    year: 2020,
    picture: commonsFilePath("Lexus IS 300h 2020.jpg"),
    ownerEmail: "user4@gmail.com",
    likes: 16,
  },
  {
    name: "Subaru",
    model: "Impreza",
    year: 2016,
    picture: commonsFilePath("'16 Subaru Impreza Hatchback (MIAS '16).jpg"),
    ownerEmail: "user5@gmail.com",
    likes: 7,
  },
  {
    name: "Tesla",
    model: "Model 3",
    year: 2022,
    picture: commonsFilePath("Tesla-Model-3-front-right.jpg"),
    ownerEmail: "user6@gmail.com",
    likes: 22,
  },
];
