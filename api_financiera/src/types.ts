export type CardStatus = "active" | "blocked" | "expired";

export interface CreditCard {
  id: string;
  userId: string;
  brand: string;
  last4: string;
  cardHolder: string;
  expiration: string;
  status: CardStatus;
  cardLimit: number;
}

export interface Database {
  creditCards: CreditCard[];
}

export interface CreateCreditCardInput {
  userId: string;
  brand: string;
  last4: string;
  cardHolder: string;
  expiration: string;
  status?: CardStatus;
  cardLimit?: number;
}
