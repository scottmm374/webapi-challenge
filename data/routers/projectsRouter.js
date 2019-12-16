const express = require("express");
const project = require("../helpers/projectModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  project
    .get()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The project information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const newProject = {
    name: req.body.name,
    description: req.body.description
  };

  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      errorMessage: "Please provide name and description for the post."
    });
  }

  project
    .insert(newProject)
    .then(data => {
      console.log(data, "data");
      if (req.body.name && req.body.description) {
        return res.status(201).send(newProject);
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the project to the database"
      });
    });
});

module.exports = router;
