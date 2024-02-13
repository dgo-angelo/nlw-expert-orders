import { ProductProps } from '@/utils/data/products';
import { ProductCartProps } from '../cart-store';

export const add = (products: ProductCartProps[], newProduct: ProductProps) => {
  const existingProduct = products.find(({ id }) => newProduct.id === id);

  if (existingProduct) {
    return products.map((product) => {
      return product.id === existingProduct.id ? { ...product, quantity: product.quantity + 1 } : product;
    });
  }

  return [...products, { ...newProduct, quantity: 1 }];
};

export const remove = (products: ProductCartProps[], productId: string) => {
  const updatedProducts = products.map((product) =>
    product.id === productId
      ? {
          ...product,
          quantity: product.quantity > 1 ? product.quantity - 1 : 0,
        }
      : product
  );

  return updatedProducts.filter((product) => product.quantity > 0);
};
