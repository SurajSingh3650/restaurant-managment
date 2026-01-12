// AI assisted development
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { User, Restaurant } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const RESTAURANTS_FILE = path.join(DATA_DIR, "restaurants.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Initialize files if they don't exist
async function initFiles() {
  await ensureDataDir();
  
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
  
  try {
    await fs.access(RESTAURANTS_FILE);
  } catch {
    await fs.writeFile(RESTAURANTS_FILE, JSON.stringify([], null, 2));
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  await initFiles();
  const data = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function saveUsers(users: User[]): Promise<void> {
  await initFiles();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    ...user,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

// Restaurants
export async function getRestaurants(): Promise<Restaurant[]> {
  await initFiles();
  const data = await fs.readFile(RESTAURANTS_FILE, "utf-8");
  return JSON.parse(data);
}

export async function saveRestaurants(restaurants: Restaurant[]): Promise<void> {
  await initFiles();
  await fs.writeFile(RESTAURANTS_FILE, JSON.stringify(restaurants, null, 2));
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const restaurants = await getRestaurants();
  return restaurants.find((r) => r.id === id) || null;
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const restaurants = await getRestaurants();
  return restaurants.find((r) => r.slug === slug) || null;
}

export async function getRestaurantsByUserId(userId: string): Promise<Restaurant[]> {
  const restaurants = await getRestaurants();
  return restaurants.filter((r) => r.userId === userId);
}

export async function createRestaurant(
  restaurant: Omit<Restaurant, "id" | "createdAt" | "updatedAt">
): Promise<Restaurant> {
  const restaurants = await getRestaurants();
  const newRestaurant: Restaurant = {
    ...restaurant,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  restaurants.push(newRestaurant);
  await saveRestaurants(restaurants);
  return newRestaurant;
}

export async function updateRestaurant(
  id: string,
  updates: Partial<Omit<Restaurant, "id" | "userId" | "createdAt">>
): Promise<Restaurant | null> {
  const restaurants = await getRestaurants();
  const index = restaurants.findIndex((r) => r.id === id);
  
  if (index === -1) return null;
  
  restaurants[index] = {
    ...restaurants[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveRestaurants(restaurants);
  return restaurants[index];
}

export async function deleteRestaurant(id: string): Promise<boolean> {
  const restaurants = await getRestaurants();
  const filtered = restaurants.filter((r) => r.id !== id);
  await saveRestaurants(filtered);
  return restaurants.length !== filtered.length;
}

