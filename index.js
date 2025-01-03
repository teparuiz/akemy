const express = require("express");
const app = express();
const { sequelize } = require("./src/models");
const invoiceRoutes = require("./src/routes/invoice");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h2>Hey si me ven!!</h2>");
});


app.use('/v1/api', invoiceRoutes);

// Sync db

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(error));
