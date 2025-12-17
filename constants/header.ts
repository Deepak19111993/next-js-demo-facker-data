export interface NavItem {
  id: number;
  name: string;
  href: string;
  submenu?: {
    title: string;
    items: Array<{
      name: string;
      description?: string;
    }>;
  }[];
}

export const navLinks: NavItem[] = [
  {
    id: 1,
    name: "Home",
    href: "/"
  },
  {
    id: 2,
    name: "Men",
    href: "",
    submenu: [
      {
        title: "Clothing",
        items: [
          { name: "T-Shirts" },
          { name: "Shirts" },
          { name: "Jeans" },
          { name: "Jackets" },
          { name: "Cotton" },
          { name: "Polyester" },
        ]
      },
      {
        title: "Footwear",
        items: [
          { name: "Sneakers" },
          { name: "Casual Shoes" },
          { name: "Formal Shoes" },
        ]
      },
      {
        title: "Accessories",
        items: [
          { name: "Watches" },
          { name: "Bags" },
          { name: "Wallets" },
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Women",
    href: "",
    submenu: [
      {
        title: "Clothing",
        items: [
          { name: "Dresses" },
          { name: "Tops" },
          { name: "Jeans" },
          { name: "Jackets" },
        ]
      },
      {
        title: "Footwear",
        items: [
          { name: "Heels" },
          { name: "Flats" },
          { name: "Boots" },
        ]
      },
      {
        title: "Accessories",
        items: [
          { name: "Jewelry" },
          { name: "Bags" },
          { name: "Scarves" },
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Kids",
    href: "",
    submenu: [
      {
        title: "Boys",
        items: [
          { name: "Clothing" },
          { name: "Footwear" },
          { name: "Accessories" }
        ]
      },
      {
        title: "Girls",
        items: [
          { name: "Clothing" },
          { name: "Footwear" },
          { name: "Accessories" }
        ]
      },
      {
        title: "Baby",
        items: [
          { name: "Newborn" },
          { name: "0-24 Months" },
          { name: "2-4 Years" }
        ]
      },
      {
        title: "Toys & Games",
        items: [
          { name: "Educational" },
          { name: "Outdoor" },
          { name: "Board Games" }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Contact",
    href: "/contact"
  }
];

export const LOGIN_BUTTON = 'Login';