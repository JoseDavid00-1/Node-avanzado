import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { CreateCreditCardInput, CreditCard, Database } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data", "db.json");

async function readDatabase(): Promise<Database> {
  const raw = await readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
}

async function writeDatabase(db: Database): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function getActiveCreditCardsByUser(
  userId: string
): Promise<CreditCard[]> {
  const db = await readDatabase();
  return db.creditCards.filter(
    (card) => card.userId === userId && card.status === "active"
  );
}

export async function getCreditCardById(
  id: string
): Promise<CreditCard | undefined> {
  const db = await readDatabase();
  return db.creditCards.find((card) => card.id === id);
}

export async function createCreditCard(
  input: CreateCreditCardInput
): Promise<CreditCard> {
  const db = await readDatabase();

  const newCard: CreditCard = {
    id: `card-${randomUUID()}`,
    userId: input.userId,
    brand: input.brand,
    last4: input.last4,
    cardHolder: input.cardHolder,
    expiration: input.expiration,
    status: input.status ?? "active",
    cardLimit: input.cardLimit ?? 0,
  };

  db.creditCards.push(newCard);
  await writeDatabase(db);

  return newCard;
}

export async function updateCardLimit(
  id: string,
  cardLimit: number
): Promise<CreditCard | undefined> {
  const db = await readDatabase();
  const card = db.creditCards.find((c) => c.id === id);

  if (!card) {
    return undefined;
  }

  card.cardLimit = cardLimit;
  await writeDatabase(db);

  return card;
}

export async function deleteCreditCard(id: string): Promise<boolean> {
  const db = await readDatabase();
  const index = db.creditCards.findIndex((c) => c.id === id);

  if (index === -1) {
    return false;
  }

  db.creditCards.splice(index, 1);
  await writeDatabase(db);

  return true;
}
