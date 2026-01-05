const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

(async () => {
  try {
    await initDB();
    console.log('Database initialized');

    const adminRouter = require('./routes/admin');
    app.use('/admin', adminRouter);

    app.get('/', (req, res) => res.redirect('/admin/products'));

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start app:', err);
  }
})();