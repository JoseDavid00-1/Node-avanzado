import { Router } from "express";
import {
  addCreditCard,
  getActiveCreditCards,
  getCreditCard,
  patchCardLimit,
  removeCreditCard,
} from "../controllers/creditCards.controller.js";

const router = Router();

router.get("/credit-cards", getActiveCreditCards);
router.get("/credit-cards/:id", getCreditCard);
router.post("/credit-cards", addCreditCard);
router.patch("/credit-cards/:id", patchCardLimit);
router.delete("/credit-cards/:id", removeCreditCard);

export default router;
