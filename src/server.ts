import '#db';
import express from 'express';
import type { Request, Response } from 'express';
import {
  createProduct,
  deleteProductById,
  getProductById,
  listProducts,
  searchProductsByTag,
  updateProductById,
} from '#services';
import type { CreateProductInput, UpdateProductInput } from '#services';

const app = express();

app.use(express.json());

app.post('/products', async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<CreateProductInput> & {
      tags?: unknown;
    };
    const { name, price, stock } = payload;

    if (
      typeof name !== 'string' ||
      typeof price !== 'number' ||
      typeof stock !== 'number'
    ) {
      res.status(400).json({
        message:
          'Product validation failed: name (string), price (number), and stock (number) are required.',
      });
      return;
    }

    const { tags } = payload;
    const normalizedTags =
      Array.isArray(tags) && tags.every((tag) => typeof tag === 'string')
        ? tags
        : [];

    const product = await createProduct({
      name,
      price,
      stock,
      tags: normalizedTags,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.get('/products', async (req: Request, res: Response) => {
  try {
    const tagQuery = req.query.tag;
    let tagParam: string | undefined;

    if (typeof tagQuery === 'string') {
      tagParam = tagQuery;
    } else if (Array.isArray(tagQuery)) {
      const firstTag = tagQuery.find((item) => typeof item === 'string');
      tagParam = typeof firstTag === 'string' ? firstTag : undefined;
    }

    if (typeof tagParam === 'string' && tagParam.trim().length > 0) {
      const products = await searchProductsByTag(tagParam);
      res.json(products);
      return;
    }

    const products = await listProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as Partial<UpdateProductInput> & {
      tags?: unknown;
    };
    const { name, price, stock } = payload;
    const { tags } = payload;

    const updates: UpdateProductInput = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        res.status(400).json({ message: 'name must be a string' });
        return;
      }
      updates.name = name;
    }

    if (price !== undefined) {
      if (typeof price !== 'number') {
        res.status(400).json({ message: 'price must be a number' });
        return;
      }
      updates.price = price;
    }

    if (stock !== undefined) {
      if (typeof stock !== 'number') {
        res.status(400).json({ message: 'stock must be a number' });
        return;
      }
      updates.stock = stock;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === 'string')) {
        res
          .status(400)
          .json({ message: 'tags must be an array of strings if provided' });
        return;
      }
      const normalizedTags = tags as string[];
      updates.tags = normalizedTags;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: 'No valid fields provided for update' });
      return;
    }

    const product = await updateProductById(id, updates);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const product = await deleteProductById(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not implemented' });
});

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

