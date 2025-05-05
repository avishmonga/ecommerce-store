import express from 'express';
import { Request, Response } from 'express';
const app = express();
const port = 3000;

app.use(express.json());

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Ecommerce Store running on http://localhost:${port}`);
});
