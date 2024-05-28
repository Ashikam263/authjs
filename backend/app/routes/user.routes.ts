// const { authJwt } = require("../middleware");
// const controller = require("../controllers/user.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.get("/api/test/all", controller.allAccess);

//   app.get(
//     "/api/test/user",
//     [authJwt.verifyToken],
//     controller.userBoard
//   );

//   app.get(
//     "/api/test/mod",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.moderatorBoard
//   );

//   app.get(
//     "/api/test/admin",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.adminBoard
//   );
// };


import express from "express";
import { allAccess, userBoard, adminBoard, moderatorBoard } from "../controllers/user.controller";
import { authJwt } from "../middleware";

const router = express.Router();

router.get("/all", allAccess);
router.get("/user", [authJwt.verifyToken], userBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
router.get("/moderator", [authJwt.verifyToken, authJwt.isModerator], moderatorBoard);

export default router;
