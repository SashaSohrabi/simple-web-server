import { Product } from '#models';
import type { ProductType } from '#types';

export type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
  tags?: string[];
};

export type UpdateProductInput = {
  name?: string;
  price?: number;
  stock?: number;
  tags?: string[];
};

export const createProduct = async (
  data: CreateProductInput
): Promise<ProductType> => {
  const product = await Product.create({
    ...data,
    createdAt: new Date(),
  });

  return product as ProductType;
};

export const listProducts = async (): Promise<ProductType[]> => {
  const products = await Product.find();
  return products as unknown as ProductType[];
};

export const getProductById = async (
  id: string
): Promise<ProductType | null> => {
  const product = await Product.findById(id);
  return product as ProductType | null;
};

export const searchProductsByTag = async (
  tag: string
): Promise<ProductType[]> => {
  const products = await Product.find({ tags: tag });
  return products as unknown as ProductType[];
};

export const updateProductById = async (
  id: string,
  updates: UpdateProductInput
): Promise<ProductType | null> => {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  return product as ProductType | null;
};

export const deleteProductById = async (
  id: string
): Promise<ProductType | null> => {
  const product = await Product.findByIdAndDelete(id);
  return product as ProductType | null;
};
