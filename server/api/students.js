// An instructor can only access their own students' data.
const router = require("express").Router();
const db = require("../db");
const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

// Deny access if user is not logged in
router.use((req, res, next) => {
	if (!req.user) {
		return res
			.status(401)
			.send("You must be logged in to do that.");
	}
	next();
});

// Get all students
router.get("/", async (req, res, next) => {
	try {
		const students = await client.student.findMany();

		res.send(students);
	} catch (error) {
		next(error);
	}
});

// Get a student by id
router.get("/:id", async (req, res, next) => {
	try {
		const student = await client.student.findUnique({
			where: {
				id: Number(req.params.id),
			},
		});

		if (!student) {
			return res.status(404).send("Student not found.");
		}

		res.send(student);
	} catch (error) {
		next(error);
	}
});

// Create a new student
router.post("/", async (req, res, next) => {
	const { name, cohort } = req.body;
	const id = 1;

	try {
		const student = await client.student.create({
			data: {
				name,
				cohort,
				instructor: { connect: { id: req.user.id } },
			},
		});
		res.status(201).send(student);
	} catch (error) {
		next(error);
	}
});

// Update a student
router.put("/:id", async (req, res, next) => {
	try {
		// const {
		// 	rows: [student],
		// } = await db.query(
		// 	"UPDATE student SET name = $1, cohort = $2 WHERE id = $3 AND instructorId = $4 RETURNING *",
		// 	[
		// 		req.body.name,
		// 		req.body.cohort,
		// 		req.params.id,
		// 		req.user.id,
		// 	]
		// );

		const { id } = req.params;
		const { name, cohort } = req.body;

		const student = await client.student.update({
			data: {
				name,
				cohort,
			},
			where: {
				id: Number(id),
			},
		});

		if (!student) {
			return res.status(404).send("Student not found.");
		}

		res.send(student);
	} catch (error) {
		next(error);
	}
});

// Delete a student by id
router.delete("/:id", async (req, res, next) => {
	try {
		// const {
		// 	rows: [student],
		// } = await db.query(
		// 	"DELETE FROM student WHERE id = $1 AND instructorId = $2 RETURNING *",
		// 	[req.params.id, req.user.id]
		// );

		const { id } = req.params;

		const student = await client.student.delete({
			where: {
				id: Number(id),
			},
		});

		if (!student) {
			return res.status(404).send("Student not found.");
		}

		res.send(student);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
