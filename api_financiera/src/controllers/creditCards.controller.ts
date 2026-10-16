import type { Request, Response } from "express";
import {
  createCreditCard,
  deleteCreditCard,
  getActiveCreditCardsByUser,
  getCreditCardById,
  updateCardLimit,
} from "../repository.js";
import type { CardStatus, CreateCreditCardInput } from "../types.js";

export async function getActiveCreditCards(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req.query.userId as string) ?? req.header("x-user-id");

  if (!userId) {
    res.status(400).json({
      error: "Falta el identificador de usuario (query 'userId' o header 'x-user-id')",
    });
    return;
  }

  try {
    const cards = await getActiveCreditCardsByUser(userId);
    res.status(200).json({
      userId,
      count: cards.length,
      data: cards,
    });
  } catch {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
}

const VALID_STATUSES: CardStatus[] = ["active", "blocked", "expired"];

export async function addCreditCard(
  req: Request,
  res: Response
): Promise<void> {
  const { userId, brand, last4, cardHolder, expiration, status, cardLimit } =
    req.body ?? {};

  const errors: string[] = [];

  if (typeof userId !== "string" || userId.trim() === "") {
    errors.push("'userId' es obligatorio y debe ser texto");
  }
  if (typeof brand !== "string" || brand.trim() === "") {
    errors.push("'brand' es obligatorio y debe ser texto");
  }
  if (typeof last4 !== "string" || !/^\d{4}$/.test(last4)) {
    errors.push("'last4' debe ser una cadena de exactamente 4 dígitos");
  }
  if (typeof cardHolder !== "string" || cardHolder.trim() === "") {
    errors.push("'cardHolder' es obligatorio y debe ser texto");
  }
  if (typeof expiration !== "string" || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) {
    errors.push("'expiration' debe tener el formato MM/YY");
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`'status' debe ser uno de: ${VALID_STATUSES.join(", ")}`);
  }
  if (
    cardLimit !== undefined &&
    (typeof cardLimit !== "number" || !Number.isFinite(cardLimit) || cardLimit < 0)
  ) {
    errors.push("'cardLimit' debe ser un número mayor o igual a 0");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Datos inválidos", details: errors });
    return;
  }

  const input: CreateCreditCardInput = {
    userId,
    brand,
    last4,
    cardHolder,
    expiration,
    status,
    cardLimit,
  };

  try {
    const card = await createCreditCard(input);
    res.status(201).json({ message: "Tarjeta creada", data: card });
  } catch {
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
}

export async function getCreditCard(
  req: Request,
  res: Response
): Promise<void> {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  try {
    const card = await getCreditCardById(id);

    if (!card) {
      res.status(404).json({ error: `No existe una tarjeta con id '${id}'` });
      return;
    }

    res.status(200).json({ data: card });
  } catch {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
}

export async function patchCardLimit(
  req: Request,
  res: Response
): Promise<void> {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const { cardLimit } = req.body ?? {};

  if (
    typeof cardLimit !== "number" ||
    !Number.isFinite(cardLimit) ||
    cardLimit < 0
  ) {
    res.status(400).json({
      error: "'cardLimit' debe ser un número mayor o igual a 0",
    });
    return;
  }

  try {
    const card = await updateCardLimit(id, cardLimit);

    if (!card) {
      res.status(404).json({ error: `No existe una tarjeta con id '${id}'` });
      return;
    }

    res.status(200).json({ message: "Límite actualizado", data: card });
  } catch {
    res.status(500).json({ error: "Error al actualizar la base de datos" });
  }
}

export async function removeCreditCard(
  req: Request,
  res: Response
): Promise<void> {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  try {
    const deleted = await deleteCreditCard(id);

    if (!deleted) {
      res.status(404).json({ error: `No existe una tarjeta con id '${id}'` });
      return;
    }

    res.status(200).json({ message: `Tarjeta '${id}' eliminada` });
  } catch {
    res.status(500).json({ error: "Error al actualizar la base de datos" });
  }
}
