const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");
const { isCelebrateError } = require("celebrate");

const {
  createClothingItem,
  likeItem,
  unlikeItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.post("/items", validateCardBody, createClothingItem);
router.delete("/items/:itemId", validateId, deleteClothingItem);

router.put("/items/:itemId/likes", validateId, likeItem);

router.delete("/items/:itemId/likes", validateId, unlikeItem);

module.exports = router;

// // Controller function for handling the "like" logic
// (err, req, res, next) => {
//   if (isCelebrateError(err)) {
//     // Handle Celebrate validation errors
//     const validationErrors = {};
//     for (const [segment, joiError] of err.details.entries()) {
//       validationErrors[segment] = {
//         message: joiError.message, // General validation message
//         details: joiError.details.map((detail) => ({
//           path: detail.path.join("."),
//           message: detail.message, // Specific validation message
//         })),
//       };
//     }
//     console.error("Validation Errors:", validationErrors);
//     return res.status(400).json({
//       status: "fail",
//       message: "Validation failed",
//       errors: validationErrors,
//     });
//   }
//   // Pass other errors to the default error handler
//   next(err);
// }
