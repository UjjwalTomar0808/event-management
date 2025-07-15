const express = require('express');
const app = express();
require('dotenv').config();

const { sequelize } = require('./models');
const eventRoutes = require('./routes/events');

app.use(express.json());
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
