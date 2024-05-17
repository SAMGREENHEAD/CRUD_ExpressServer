import { Router } from "express";

import productsRouter from "./products.js";
import usersRouter from "./users.js";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
