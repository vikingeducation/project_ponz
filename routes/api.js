const router = require("express").Router();
const controllers = require("../controllers");

router.get("/:resource", (req, res, next) => {
	const resource = req.params.resource;

	const controller = controllers[resource];
	if (controller == null) {
		res.json({
			confirmation: "fail",
			resource: "invalid resource"
		});

		return;
	}

	controller.index(req, res, next);
});

router.get("/:resource/:id", (req, res, next) => {
	const resource = req.params.resource;

	const controller = controllers[resource];

	if (controller == null) {
		res.json({
			confirmation: "fail",
			resource: "invalid resource"
		});

		return;
	}

	controller.view(req, res, next);
});

router.post("/:resource", (req, res, next) => {
	const resource = req.params.resource;

	const controller = controllers[resource];

	if (controller == null) {
		res.json({
			confirmation: "fail",
			resource: "invalid resource"
		});

		return;
	}

	controller.createUser(req, res, next);
});

module.exports = router;
