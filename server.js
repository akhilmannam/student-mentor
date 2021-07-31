const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
require("dotenv").config();
const URL = process.env.URL;
const DB = "student-mentor";
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//Create student
app.post("/student", async function (req, res) {
	try {
		req.body.mentor = "";
		let connection = await mongodb.connect(URL);
		let db = connection.db(DB);
		await db.collection("students").insertOne(req.body);
		await connection.close();
		res.json({
			message: "student created",
		});
	} catch (error) {
		console.log(error);
	}
});

//Create mentor
app.post("/mentor", async function (req, res) {
	try {
		req.body.students = [];
		let connection = await mongodb.connect(URL);
		let db = connection.db(DB);
		await db.collection("mentors").insertOne(req.body);
		await connection.close();
		res.json({
			message: "mentor created",
		});
	} catch (error) {
		console.log(error);
	}
});

//Assign students to mentor
app.put("/mentor/:id", async function (req, res) {
	try {
		let connection = await mongodb.connect(URL);
		let db = connection.db(DB);
		await db
			.collection("mentors")
			.updateOne(
				{ _id: mongodb.ObjectID(req.params.id) },
				{ $set: req.body }
			);
		res.json({
			message: "Students Assigned to Mentor",
		});
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

//Assign mentor to student
app.put("/student/:id", async function (req, res) {
	try {
		let connection = await mongodb.connect(URL);
		let db = connection.db(DB);
		await db
			.collection("students")
			.updateOne(
				{ _id: mongodb.ObjectID(req.params.id) },
				{ $set: req.body }
			);
		res.json({
			message: "Mentor Assigned to Student",
		});
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

//Get students for a particular mentor
app.get("/mentor/:id", async function (req, res) {
	try {
		let connection = await mongodb.connect(URL);
		let db = connection.db(DB);
		let students = await db
			.collection("mentors")
			.find({ _id: mongodb.ObjectID(req.params.id) })
			.project({ students: 1, _id: 0, mentor: 1 })
			.toArray();
		res.json(students);
		await connection.close();
	} catch (error) {
		console.log(error);
	}
});

app.listen(port);
