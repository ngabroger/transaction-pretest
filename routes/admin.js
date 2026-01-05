const express = require('express');
const router = express.Router();
const { getDb, getDB } = require('../db');


router.get('/products', async (req, res) => {
  const db = getDB();
  const products = await db.all(`
    SELECT p.id, p.name, p.price, COALESCE(s.quantity, 0) AS quantity
    FROM products p
    LEFT JOIN stock s ON s.product_id = p.id
    ORDER BY p.id
  `);
  res.render('products', { products });
});
    

router.get('/purchase/new', async (req, res) => {
  const db = getDB();
  const products = await db.all('SELECT id, name, price FROM products ORDER BY id');
  res.render('recent_purchase', { products, errors: null, old: {} });
});


router.post('/purchase', async (req, res) => {
  const db = getDB();
  const product_id = parseInt(req.body.product_id, 10);
  const qty = parseInt(req.body.qty, 10);

  if (!product_id || !qty || qty <= 0) {
    const products = await db.all('SELECT id, name, price FROM products ORDER BY id');
    return res.render('recent_purchase', { products, errors: ['Masukkan product dan qty yang valid'], old: req.body });
  }

  try {
    await db.exec('BEGIN TRANSACTION');
    const stockRow = await db.get('SELECT quantity FROM stock WHERE product_id = ?', product_id);
    const currentQty = stockRow ? stockRow.quantity : 0;

    if (currentQty < qty) {
      await db.exec('ROLLBACK');
      const products = await db.all('SELECT id, name, price FROM products ORDER BY id');
      return res.render('recent_purchase', { products, errors: ['Stock tidak cukup'], old: req.body });
    }

    const product = await db.get('SELECT price FROM products WHERE id = ?', product_id);
    const total = product.price * qty;

    await db.run('UPDATE stock SET quantity = quantity - ? WHERE product_id = ?', qty, product_id);

    await db.run('INSERT INTO purchases (product_id, qty, total_price, status) VALUES (?, ?, ?, ?)', product_id, qty, total, 'active');

    await db.exec('COMMIT');
    res.redirect('/admin/purchases');
  } catch (err) {
    await db.exec('ROLLBACK').catch(()=>{});
    console.error(err);
    res.status(500).send('Terjadi error server');
  }
});


router.get('/purchases', async (req, res) => {
  const db = getDB();
  const purchases = await db.all(`
    SELECT pu.id, pu.product_id, pu.qty, pu.total_price, pu.status, pu.created_at,
           p.name AS product_name
    FROM purchases pu
    JOIN products p ON p.id = pu.product_id
    ORDER BY pu.created_at DESC
  `);
  res.render('purchases', { purchases });
});


router.post('/purchase/:id/cancel', async (req, res) => {
  const db = getDB();
  const id = parseInt(req.params.id, 10);

  try {
    await db.exec('BEGIN TRANSACTION');

    const purchase = await db.get('SELECT * FROM purchases WHERE id = ?', id);
    if (!purchase) {
      await db.exec('ROLLBACK');
      return res.status(404).send('Pembelian tidak ditemukan');
    }
    if (purchase.status === 'cancelled') {
      await db.exec('ROLLBACK');
      return res.status(400).send('Pembelian sudah dibatalkan');
    }

    const stockRow = await db.get('SELECT quantity FROM stock WHERE product_id = ?', purchase.product_id);
    if (stockRow) {
      await db.run('UPDATE stock SET quantity = quantity + ? WHERE product_id = ?', purchase.qty, purchase.product_id);
    } else {
      await db.run('INSERT INTO stock (product_id, quantity) VALUES (?, ?)', purchase.product_id, purchase.qty);
    }

    await db.run('UPDATE purchases SET status = ? WHERE id = ?', 'cancelled', id);

    await db.exec('COMMIT');
    res.redirect('/admin/purchases');
  } catch (err) {
    await db.exec('ROLLBACK').catch(()=>{});
    console.error(err);
    res.status(500).send('Terjadi error server');
  }
});

module.exports = router;