import React, {useRef, useState} from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
} from 'react-native';
// import  NumericPad  from  'react-native-numeric-pad'
import { Lucide } from "@react-native-vector-icons/lucide";
import { Rate, HomeProps } from '../types/types';
import styles from './homeStyles';

export default function Home({ rates }: HomeProps) {
  console.log({ rates });

  const [fromPrice, setFromPrice] = useState(1);
  const [toPrice, setToPrice] = useState((rates[0].rate).toFixed(2) as unknown as number);
  const [selectedCurrency, setSelectedCurrency] = useState<Rate>(rates[0]);
  const [isPressed, setIsPressed] = useState(false);

  const translateYFromPrice = useRef(new Animated.Value(0)).current;
  const translateYToPrice = useRef(new Animated.Value(0)).current;
  const translateYRefPrice = useRef(new Animated.Value(0)).current;
  const rotationButtonMoneyChanger = useRef(new Animated.Value(0)).current;

  const onPressBadge = (currency: Rate) => {
    setSelectedCurrency(currency);
    calculateToPrice(fromPrice, currency);
  };

  const formatInput = (text: string) => {
    // Remove non-numeric characters except for the decimal point
    const cleanedText = text.replace(/[^0-9]/g, '');
    console.log('cleanedText', cleanedText);

    return +cleanedText
  }

  const onChangeFromPriceText = (text: string) => {
    setFromPrice(formatInput(text));
    calculateToPrice(formatInput(text), selectedCurrency);
  }

  const onChangeToPriceText = (text: string) => {
    const from = +text / selectedCurrency.rate;
    setFromPrice(from.toFixed(2) as unknown as number);
    setToPrice(+text);
  }

  const calculateToPrice = (from: number, currency: Rate) => {
    const price = from * currency.rate;
    setToPrice(price.toFixed(2) as unknown as number);
  }

  const onPressMoneyChanger = () => {
    Animated.parallel([
      Animated.timing(translateYFromPrice, {
        toValue: isPressed ? 0 : 205,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(translateYToPrice, {
        toValue: isPressed ? 0 : -180,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(translateYRefPrice, {
        toValue: isPressed ? 0 : 30,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(rotationButtonMoneyChanger, {
        toValue: isPressed ? 0 : 100,
        duration: 900,
        useNativeDriver: true,
      })

    ]).start();

    setIsPressed(!isPressed);
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <View style={styles.square}>
          {/* From Money container */}
          <Animated.View
            style={{ transform: [{ translateY: translateYFromPrice }] } }
          >
            <View>
              <View style={styles.moneyContainer}>
                { selectedCurrency.currency == 'BCV_USD' && <Image style={styles.currencyIcon} source={require('../assets/bcv.jpeg')} />}
                { selectedCurrency.currency == 'BCV_EUR' && <Image style={styles.currencyIcon} source={require('../assets/euro.png')} />}
                { selectedCurrency.currency == 'YD_USD' && <Image style={styles.currencyIcon} source={require('../assets/usdt.jpg')} />}
                <TextInput
                  editable={isPressed ? false : true}
                  autoFocus
                  inputMode='numeric'
                  style={styles.input}
                  onChangeText={onChangeFromPriceText}
                  value={fromPrice.toString()}
                />
              </View>
              <View style={styles.badgeContainer}>
                {rates.map((currency) => (
                  <TouchableOpacity 
                    key={Math.random().toString()}
                    style={currency.currency == selectedCurrency.currency ? [styles.badge, styles.badgeBg] : styles.badge }
                    onPress={() => onPressBadge(currency)}
                  >
                    <Text style={styles.badgeText}>{currency.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
          
          {/* Circle button money changer */}
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotationButtonMoneyChanger.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity style={styles.circleChanger} onPress={onPressMoneyChanger}>
              <Lucide name="arrow-down-up" size={40} />
            </TouchableOpacity>
          </Animated.View>
          
          {/* To Money container */}
          <Animated.View
            style={{ transform: [{ translateY: translateYToPrice }] } }
          >
            <View style={styles.moneyContainer}>
              <Image style={styles.currencyIcon} source={require('../assets/venezuela.png')} />
              <TextInput
                editable={isPressed ? true : false}
                autoFocus
                inputMode='numeric'
                style={styles.input}
                onChangeText={onChangeToPriceText}
                value={toPrice.toString()}
              />
            </View>
          </Animated.View>

          {/* Exhample text */}
          <Animated.View style={{ transform: [{ translateY: translateYRefPrice }] } }>
            <Text style={[styles.textExample, { marginTop: isPressed ? 5 : 20 }]}>
              1 {selectedCurrency.name} = {selectedCurrency.rate} VES
            </Text>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}