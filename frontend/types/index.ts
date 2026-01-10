// AI assisted development
export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface Restaurant {
  id: string;
  userId: string;
  name: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  menu: MenuItem[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  slug: string; // unique URL identifier
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

