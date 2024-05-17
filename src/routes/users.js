import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.js";
import { createuserValidationScheme } from "../utils/validationSchemas.js";
import { resolveIndexUserBYId } from "../utils/middlewares.js";
import { user } from "../mongoose/schema/user.js";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage(" must be at least 3-10 characters long"),
  (req, res) => {
    console.log(req.session.id);
    console.log(req.sessionStore.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    const result = validationResult(req);
    //destruturing the request and query parameters
    const {
      query: { filter, value },
    } = req;
    //when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    //when filter and value are defined
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.send(mockUsers);
  }
);

router.get("/api/users/:id", resolveIndexUserBYId, (req, res) => {
  const { finduserIndex } = req;
  const finduser = mockUsers[finduserIndex];
  if (!finduser) return res.sendStatus(404);
  //if available return the user
  return res.send(finduser);
});

router.post(
  "/api/users",
  checkSchema(createuserValidationScheme),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const data = matchedData(req);
    const { newuser } = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newuser);

    return res.sendStatus(201).send(newuser);
  }
);

router.put("/api/users/:id", resolveIndexUserBYId, (req, res) => {
  console.log(req.body);
  const { body, finduserIndex } = req;

  //if not negative one
  mockUsers[finduserIndex] = { id: mockUsers[finduserIndex].id, ...body };
  return res.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexUserBYId, (req, res) => {
  const { finduserIndex } = req;

  mockUsers.splice(finduserIndex, 1);
  return res.sendStatus(200);
});

//for database
router.post(
  "/api/users/new",
  checkSchema(createuserValidationScheme),
  async (req, res) => {
    //for outputing errors in validation
    const result = validationResult(req);
    //if there are errors in validation give them
    if (!result.isEmpty()) return res.send(result.array());

    //then continue processing using the validated data
    const data = matchedData(req);
    const newuser = new user(data);
    try {
      const saveduser = await newuser.save();
      return res.status(201).send(saveduser);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

router.patch("/api/users/:id", resolveIndexUserBYId, (req, res) => {
  const { body, finduserIndex } = req;
  mockUsers[finduserIndex] = { ...mockUsers[finduserIndex], ...body };
  return res.sendStatus(200);
});

export default router;
