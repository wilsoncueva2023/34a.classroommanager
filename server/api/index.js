const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();

router.use("/students", require("./students"));

module.exports = router;
