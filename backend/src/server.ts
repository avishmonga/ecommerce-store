import express from 'express';
import { Request, Response } from 'express';
import cartRouter from './routes/cart';
const app = express();
const port = 3000;

app.use(express.json());


app.use('/api/cart', cartRouter)

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Ecommerce Store running on http://localhost:${port}`);
});
