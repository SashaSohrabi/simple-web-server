import '#db';
import {
  createProduct,
  deleteProductById,
  getProductById,
  listProducts,
  searchProductsByTag,
  updateProductById,
} from '#services';
import { Command } from 'commander';

const successLog = (message: string) =>
  console.log('\x1b[32m%s\x1b[0m', message);

const program = new Command();
program
  .name('ecommerce-cli')
  .description('Simple product CRUD CLI')
  .version('1.0.0');

// CREATE
program
  .command('add')
  .description('Add a new product')
  .argument('<name>', 'Product name')
  .argument('<price>', 'Product price')
  .argument('<stock>', 'Stock quantity')
  .argument('[tags...]', 'Product tags')
  .action(async (name, priceStr, stockStr, tags: string[] = []) => {
    try {
      const price = Number(priceStr);
      const stock = Number(stockStr);

      const newProduct = await createProduct({
        name,
        price,
        stock,
        tags,
      });

      console.log(newProduct);
      successLog('✅ Product created successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          '\\x1b[31mSomething went wrong',
          error.message,
          '\\x1b[0m'
        );
      } else {
        console.error('\\x1b[31mAn unknown error occurred\\x1b[0m');
      }
    }
  });

// READ
program
  .command('list')
  .description('List all products')
  .action(async () => {
    try {
      const allProducts = await listProducts();
      console.log(allProducts);
    } catch (error: unknown) {
      console.error('\\x1b[31mSomething went wrong', error, '\\x1b[0m');
    }
  });

program
  .command('get')
  .description('Get product by ID')
  .argument('<id>', 'Product ID')
  .action(async (id: string) => {
    try {
      const product = await getProductById(id);
      console.log('Product:', product);
    } catch (error: unknown) {
      console.error('\\x1b[31mSomething went wrong', error, '\\x1b[0m');
    }
  });

program
  .command('search')
  .description('Search products by tag')
  .argument('<Tag>', 'Product tag')
  .action(async (tag: string) => {
    try {
      const products = await searchProductsByTag(tag);
      console.log('Product:', products);
    } catch (error: unknown) {
      console.error('\\x1b[31mSomething went wrong', error, '\\x1b[0m');
    }
  });

// UPDATE
program
  .command('update')
  .description('Update product by ID')
  .argument('<id>', 'Product ID')
  .argument('<name>', 'Product name')
  .argument('<price>', 'Product price')
  .argument('<stock>', 'Stock quantity')
  .argument('[tags...]', 'Product tags')
  .action(async (id: string, name, priceStr, stockStr, tags: string[] = []) => {
    try {
      const price = Number(priceStr);
      const stock = Number(stockStr);

      const result = await updateProductById(id, {
        name,
        price,
        stock,
        tags,
      });
      if (result) {
        console.log(result);
        successLog('✅ Product updated successfully');
      } else {
        console.log('No product found with the provided ID.');
      }
    } catch (error: unknown) {
      console.error('\\x1b[31mSomething went wrong', error, '\\x1b[0m');
    }
  });

// DELETE
program
  .command('delete')
  .description('Delete product by ID')
  .argument('<id>', 'Product ID')
  .action(async (id: string) => {
    try {
      const result = await deleteProductById(id);
      if (result) {
        console.log(result);
        successLog('✅ Product deleted successfully');
      } else {
        console.log('No product found with the provided ID.');
      }
    } catch (error: unknown) {
      console.error('\\x1b[31mSomething went wrong', error, '\\x1b[0m');
    }
  });

program.hook('postAction', () => process.exit(0));
program.parse();
