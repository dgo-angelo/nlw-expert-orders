import { PRODUCTS } from '@/utils/data/products';
import { useLocalSearchParams, useNavigation, Redirect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, Text, Image, ScrollView } from 'react-native';

import { formatCurrency } from '@/utils/functions/format-currency';
import { Button } from '@/components/button';
import LinkButton from '@/components/link-button';
import React from 'react';
import { useCartStore } from '@/stores/cart-store';

const Product = () => {
  const cartStore = useCartStore();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    return <Redirect href='/' />;
  }
  const handleAddToCart = () => {
    cartStore.add(product);
    navigation.goBack();
  };

  return (
    <View className='flex-1'>
      <Image source={product.cover} className='w-full h-52' resizeMode='cover' />

      <View className='p-5 mt-8 flex-1'>
        <ScrollView>
          <Text className='text-white text-xl text-heading'>{product.title}</Text>
          <Text className='text-lime-400 text-2xl font-heading my-2'>{formatCurrency(product.price)}</Text>
          <Text className='text-slate-400 text-2xl font-body tex-base leading-6 mb-6'>{product.description}</Text>

          {product.ingredients.map((ingredient) => (
            <Text key={ingredient} className='text-slate-400 font-body text-base leading-6'>
              {'\u2022'} {ingredient}
            </Text>
          ))}
        </ScrollView>
        <View className='p-5 pb-0 gap-3'>
          <Button onPress={handleAddToCart}>
            <Button.Icon>
              <Feather name='plus-circle' size={20} />
            </Button.Icon>

            <Button.Text>Adicionar ao pedido</Button.Text>
          </Button>

          <LinkButton title='Voltar ao cardápio' href='/' />
        </View>
      </View>
    </View>
  );
};

export default Product;
