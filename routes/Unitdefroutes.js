const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/unitDefController");


router.get("/",           controller.getUnitDefs);

router.post("/",          controller.createUnitDef);

router.post("/bulk-save", controller.bulkSaveUnitDefs);

router.post("/reset",     controller.resetUnitDefs);


router.put("/:id",        controller.updateUnitDef);


router.delete("/:id",     controller.deleteUnitDef);

module.exports = router;