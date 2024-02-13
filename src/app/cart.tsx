import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { useCartStore } from '../stores/cart-store';
import { useState } from 'react';
import { useNavigation } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather } from '@expo/vector-icons';
import { Product } from '@/components/product';
import { Header } from '../components/header';
import { formatCurrency } from '../utils/functions/format-currency';
import Input from '@/components/input';
import { Button } from '@/components/button';
import LinkButton from '@/components/link-button';
import { ProductProps } from '@/utils/data/products';

const PHONE_NUMBER = 'seu_numero_aqui';

const Cart = () => {
  const [address, setAddress] = useState('');
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0));
  const handleProductRemove = (product: ProductProps) => {
    Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`, [
      {
        text: 'Cancelar',
      },
      {
        text: 'Confirmar',
        onPress: () => {
          cartStore.remove(product.id);
        },
      },
    ]);
  };

  const handleOrder = () => {
    if (address.trim().length === 0) {
      return Alert.alert('Pedido', 'Informe os dados da entrega.');
    }

    const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join('');

    const messages = [];
    messages.push('🍔 NOVO PEDIDO');
    messages.push(`\n\nEntregar em: ${address}`);
    messages.push(`\n${products}`);
    messages.push(`\n\nValor total: ${total}`);

    Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${messages.join('')}`);
    cartStore.clear();
    navigation.goBack();
  };

  return (
    <View className='flex-1 pt-8'>
      <Header title='Seu carrinho' />
      <KeyboardAwareScrollView>
        <ScrollView>
          <View className='p-5 flex-1'>
            {cartStore.products.length > 0 ? (
              <View className='border-b border-slate-700'>
                {cartStore.products.map((cartProduct) => (
                  <Product data={cartProduct} key={cartProduct.id} onPress={() => handleProductRemove(cartProduct)} />
                ))}
              </View>
            ) : (
              <Text className='font-body text-slate-400 text-center my-8'> Seu carrinho esta vazio.</Text>
            )}

            <View className='flex-row gap-2 items-center mt-5 mb-4 justify-between px-2'>
              <Text className='text-white text-xl font-subtitle'>Total:</Text>
              <Text className='text-lime-400 text-2xl font-heading'>{total}</Text>
            </View>

            <Input
              placeholder='Informe o endereço de entrega: Rua, Bairro, CEP, Número e Complemento...'
              onChangeText={setAddress}
              value={address}
              blurOnSubmit={true}
              onSubmitEditing={handleOrder}
              returnKeyType='next'
            ></Input>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className='p-5 gap-5'>
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name='arrow-right-circle' size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title='Voltar ao cardápio' href='/'></LinkButton>
      </View>
    </View>
  );
};

export default Cart;
