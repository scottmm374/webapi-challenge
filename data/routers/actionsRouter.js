const express = require("express");
const action = require("../helpers/actionModel.js");
// const { getProjectActions } = require("../helpers/projectModel.js");
//
const router = express.Router({
  mergeParams: true
});

// Get Specific Project Action by ID

router.get("/:id", (req, res) => {
  action
    .get(req.params.id)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res
        .status(500)
        .json({ error: "The information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const id = req.params.id;
  const newAction = {
    project_id: req.params.id,
    notes: req.body.notes,
    description: req.body.description,
    completed: req.body.completed || false
  };

  if (!req.body.notes || !req.body.description) {
    return res.status(400).json({
      errorMessage: "Please provide notes and description for the post."
    });
  }
  action.get(id).then(data => {
    console.log(data);
    if (!data) {
      return res.status(404).json({ message: "The ID does not exist." });
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
      res.status(500).json({
        errorMessage:
          "There was an error while saving the action to the database"
      });
    });
});

router.delete("/:id", (req, res) => {
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
        error: "There was an error deleting the action"
      });
    });
});

router.put("/:actionId", (req, res) => {
  const updateAction = {
    project_id: req.params.id,
    notes: req.body.notes,
    description: req.body.description,
    completed: req.body.completed || false
  };

  action.get(req.params.actionId).then(data => {
    if (!data) {
      return res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }

    if (!req.body.notes || !req.body.description) {
      return res.status(400).json({
        errorMessage: "Please provide note and description for the action."
      });
    }

    action
      .update(req.params.actionId, updateAction)
      .then(data => {
        return res.status(200).send(updateAction);
      })
      .catch(error => {
        return res.status(500).json({
          error: "The action information could not be modified."
        });
      });
  });
});

module.exports = router;
