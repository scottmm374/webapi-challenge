const express = require("express");
const action = require("../helpers/actionModel.js");
// const { getProjectActions } = require("../helpers/projectModel.js");
const router = express.Router({
  mergeParams: true
});

router.get("/", (req, res) => {
  action
    .get()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res
        .status(500)
        .json({ error: "The information could not be retrieved." });
    });
});

router.post("/:id", (req, res) => {
  const id = req.params.id;
  const newAction = {
    project_id: req.params.id,
    notes: req.body.notes,
    description: req.body.description
  };

  if (!req.body.notes || !req.body.description) {
    return res.status(400).json({
      errorMessage: "Please provide notes and description for the post."
    });
  }
  action.get(id).then(data => {
    console.log(data);
    if (!data) {
      return res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  });

  action
    .insert(newAction)
    .then(data => {
      console.log(data, "data");
      if (req.body.notes && req.body.description) {
        return res.status(201).send(newAction);
      }
    })
    .catch(error => {
      returnres.status(500).json({
        errorMessage:
          "There was an error while saving the action to the database"
      });
    });
});

router.delete("/:id", (req, res) => {
  //   const id = req.params.id;
  //   const actionsId = req.params.id

  action.get(req.params.id).then(data => {
    if (!data) {
      return res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }
  });
  action
    .remove(req.params.id)
    .then(data => {
      if (data) {
        return res.status(200).json({ Message: "Action deleted" });
      }
    })
    .catch(error => {
      console.log(error, "err");
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

module.exports = router;
