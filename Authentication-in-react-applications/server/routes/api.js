const express = require('express');


const router = new express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message. This is pushed from the api: routes/api.js"
  });
});


module.exports = router;
