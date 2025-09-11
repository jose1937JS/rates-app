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
import RNShake from 'react-native-shake';
import { formatPrice, unFormatPrice, formatDate } from '../utils/helpers';

export default function Home({ rates }: HomeProps) {
  // console.log({ rates });

  const [fromPrice, setFromPrice] = useState<string | number>(1);
  const [toPrice, setToPrice] = useState<string | number>((rates[0].rate).toFixed(2));
  const [selectedCurrency, setSelectedCurrency] = useState<Rate>(rates[0]);
  const [isPressed, setIsPressed] = useState(false);

  const translateYFromPrice = useRef(new Animated.Value(0)).current;
  const translateYToPrice = useRef(new Animated.Value(0)).current;
  const translateYRefPrice = useRef(new Animated.Value(0)).current;
  const rotationButtonMoneyChanger = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const subscription = RNShake.addListener(() => {
      setFromPrice(1);
      setToPrice((selectedCurrency.rate).toFixed(2));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onPressBadge = (currency: Rate) => {
    setSelectedCurrency(currency);
    const price = isPressed ? toPrice : fromPrice;
    calculateToPrice(typeof price === 'string' ? Number(price) : price, currency);
  };

  const formatInput = (text: string) => {
    // Permitir solo números y un punto como separador decimal
    let cleanedText = text.replace(/[^0-9.]/g, '');
    // Permitir solo un punto
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      cleanedText = parts[0] + '.' + parts.slice(1).join('');
    }
    // Permitir que el usuario escriba solo el punto inicial o termine en punto
    if (cleanedText === '' || cleanedText === '.') return cleanedText;
    return cleanedText;
  }

  const onChangeFromPriceText = (text: string) => {
    const formatted = formatInput(text);
    setFromPrice(formatted);
    // Solo calcular si el input es un número válido
    if (!isNaN(Number(formatted)) && formatted !== '' && formatted !== '.') {
      calculateToPrice(Number(formatted), selectedCurrency);
    }
  }

  const onChangeToPriceText = (text: string) => {
    const formatted = formatInput(text);
    if (!isNaN(Number(formatted)) && formatted !== '' && formatted !== '.') {
      const from = Number(formatted) / selectedCurrency.rate;
      const result = formatPrice(from) as unknown as number;
      setFromPrice(result);
      setToPrice(formatted);
    } else {
      setToPrice(formatted);
    }
  }

  const calculateToPrice = (from: number, currency: Rate) => {
    const price = isPressed ? from / currency.rate : from * currency.rate;
    const result = formatPrice(price) as unknown as number;

    if(isPressed) {
      setFromPrice(result);
    }
    else {
      setToPrice(result);
    }
  }

  const onPressMoneyChanger = () => {
    // Convierte los valores formateados de vuelta a números para el cálculo
    if(!isPressed) {
      setToPrice(unFormatPrice(toPrice.toString()));
    }

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
              <View style={[styles.moneyContainer, { backgroundColor: isPressed ? '#dbdbdbff' :  'transparent' }]}>
                { selectedCurrency.currency == 'BCV_USD' && <Image style={styles.currencyIcon} source={require('../assets/bcv.jpeg')} />}
                { selectedCurrency.currency == 'BCV_EUR' && <Image style={styles.currencyIcon} source={require('../assets/euro.png')} />}
                { selectedCurrency.currency == 'YD_USD' && <Image style={styles.currencyIcon} source={require('../assets/usdt.jpg')} />}
                <TextInput
                  editable={isPressed ? false : true}
                  autoFocus
                  inputMode='decimal'
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
            <View style={[styles.moneyContainer, { backgroundColor: isPressed ? 'transparent' :  '#ccc' }]}>
              <Image style={styles.currencyIcon} source={require('../assets/venezuela.png')} />
              <TextInput
                editable={isPressed ? true : false}
                autoFocus
                inputMode='decimal'
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
          
          <View style={{ marginTop: isPressed ? 40 : 20 }}>
            <Text>Ultima actualización a las { formatDate(selectedCurrency.createdAt) }</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}