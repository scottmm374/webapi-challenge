const express = require("express");
const project = require("../helpers/projectModel.js");
const actionsRouter = require("./actionsRouter");
const router = express.Router();
router.use("/:id/actions", actionsRouter);

router.get("/", (req, res) => {
  project
    .get()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res
        .status(500)
        .json({ error: "The project information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  project
    .getProjectActions(req.params.id)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res
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
        return res.status(201).json({ message: "new project created" });
      }
    })
    .catch(error => {
      return res.status(500).json({
        errorMessage:
          "There was an error while saving the project to the database"
      });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  project.get(id).then(data => {
    if (!data) {
      return res
        .status(404)
        .json({ Message: "Project with that ID not found" });
    }
  });
  project
    .remove(id)
    .then(data => {
      if (data) {
        return res.status(200).json("Project Deleted");
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The project could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const updateProject = {
    name: req.body.name,
    description: req.body.description
  };
  const id = req.params.id;

  project.get(id).then(data => {
    if (!data) {
      return res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }

    if (!req.body.name || !req.body.description) {
      return res.status(400).json({
        errorMessage: "Please provide name and description for the post."
      });
    }

    project
      .update(id, updateProject)
      .then(data => {
        return res.status(200).json({ message: "Project updated" });
      })
      .catch(error => {
        return res.status(500).json({
          error: "The project information could not be modified."
        });
      });
  });
});

module.exports = router;
