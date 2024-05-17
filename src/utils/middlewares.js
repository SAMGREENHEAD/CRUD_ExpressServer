import { mockUsers } from "./constants.js";

export const resolveIndexUserBYId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  //check if ID is a number
  const parseid = parseInt(req.params.id);
  //check if not a numeric and find the user.
  if (isNaN(parseid))
    return res.status(404).send({ msg: "bad request: Invalid ID" });
  const finduserIndex = mockUsers.findIndex((user) => user.id == parseid);
  //check if find user index is not found
  if (finduserIndex == -1) return res.status(404);
  req.finduserIndex = finduserIndex;
  next();
};
