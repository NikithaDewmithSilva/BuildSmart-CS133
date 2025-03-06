const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Import CAD routes
const cadRoutes = require("./cadServer");
app.use("/api/cad", cadRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});