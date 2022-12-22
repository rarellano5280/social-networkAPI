const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  getThought(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
createThought(req, res) {
  Thought.create(req.body)
  .then(({ _id }) => {
    return User.findByIdAndUpdate(
      { _id: req.body.userId },
      {$push: { thoughts: _id}},
      {new: true}
    );
   })
   .then((thought) => 
   !thought
   ? res.status(404).json({ message: "No thought with this ID!" })
   : res.json(thought)
   )
   .catch ((err) => res.status(500).json(err));
},
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findByIdAndUpdate({ thoughts: req.params.thoughtId}, 
            {$pull: {thought: req.params.thoughtId}},
            {new : true}
            )
          )
      .then((user) => 
      !user
      ? res.status(404).json({ message: 'Deleted thought, but no user was found witht hat ID' })
      : res.json ({ message: 'Thought was successfully deleted.'})
      )
      .catch((err) =>
      res.status(500).json(err))
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No thought with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Create a reaction
createReaction(req,res) {
  Thought.findOneAndUpdate(
    { _id: req.parmas.thoughtId },
    { $addToSet: { reactions: req.body }},
    { runValidators: true, new: true }
  ) 
    .then((thought) => 
    !thought
    ? res.status(404).json({ message: 'No thought with this ID' })
          : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

//Delete a reaction 
deleteReaction(req,res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId}}},
    { runValidators: true, new: true }
  )
  .then((thought) => 
  !thought
  ? res.status(404).json({ message: 'No thought with this ID' })
        : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
  }
};