const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());

// Serve images from 'public' folder
app.use("/image", express.static("public/image"));

app.listen(6000, () => {
  console.log("Server running on http://localhost:5000");
});
