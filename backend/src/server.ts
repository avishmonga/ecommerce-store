import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Add JSON body parser
app.use(express.urlencoded({ extended: true })); // Add URL-encoded body parser

// Health check route
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK' });
});

// Cart routes
app.use('/api/cart', cartRoutes);

// Checkout routes
app.use('/api/checkout', checkoutRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
);

app.listen(port, () => {
  console.log(`Ecommerce Store running on http://localhost:${port}`);
});
