import React, { useRef, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
  Share
} from 'react-native';
// import  NumericPad  from  'react-native-numeric-pad'
import Toast from 'react-native-simple-toast';
import { Lucide } from "@react-native-vector-icons/lucide";
import { Rate, HomeProps } from '../types/types';
import styles from './homeStyles';
import RNShake from 'react-native-shake';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { formatPrice, formatDate, unFormatPrice } from '../utils/helpers';
import ErrorComponent from './components/Error'

export default function Home({ rates, onRefreshData }: HomeProps) {
  if (!rates?.length) {
    return (
      <ErrorComponent onRefreshData={onRefreshData} />
    )
  }

  const [fromPrice, setFromPrice] = useState<string | number>(1);
  const [toPrice, setToPrice] = useState<string | number>((rates[0].rate).toFixed(2));
  const [selectedCurrency, setSelectedCurrency] = useState<Rate>(rates[0]);
  const [isPressed, setIsPressed] = useState<boolean>(false); // Para cuando se presiona el botón de cambio de moneda
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const menuItems = [
    { label: 'Compartir', icon: 'forward', labelStyle: { color: 'white' } },
    { label: 'Reiniciar', icon: 'rotate-cw', labelStyle: { color: 'white' } },
    { label: 'Refrescar', icon: 'circle-dollar-sign', labelStyle: { color: 'white' } },
  ];

  const translateYFromPrice = useRef(new Animated.Value(0)).current;
  const translateYToPrice = useRef(new Animated.Value(0)).current;
  const translateYRefPrice = useRef(new Animated.Value(0)).current;
  const rotationButtonMoneyChanger = useRef(new Animated.Value(0)).current;

  // Shake event listener to reset prices
  React.useEffect(() => {
    const subscription = RNShake.addListener(() => onRefreshValues());

    return () => {
      subscription.remove();
    };
  }, []);

  const onRefreshValues = () => {
    setFromPrice(1);
    setToPrice((selectedCurrency.rate).toFixed(2));
    Vibration.vibrate([0, 100]);
    Toast.show('Valores restablecidos', Toast.SHORT);
  }

  const onPressBadge = (currency: Rate) => {
    setSelectedCurrency(currency);
    const price = isPressed ? unFormatPrice(toPrice.toString()) : unFormatPrice(fromPrice.toString());
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

    if (isPressed) {
      setFromPrice(result);
    }
    else {
      setToPrice(result);
    }
  }

  const onShare = async () => {
    try {
      let message = ''
      const filteredRates = rates.filter((r) => selectedCurrency.name !== r.name);
      const clearedToPrice = unFormatPrice(toPrice.toString())

      if (isPressed) {
        if(filteredRates.length > 0) {
          const firstCalc = +clearedToPrice / filteredRates[0]?.rate;
          const secondCalc = +clearedToPrice / filteredRates[1]?.rate;
  
          message = `${toPrice} Bs equivalen a: \n\n- ${formatPrice(+fromPrice)} ${selectedCurrency?.name} \n- ${formatPrice(firstCalc)} ${filteredRates[0]?.name} \n- ${formatPrice(secondCalc)} ${filteredRates[1]?.name}`;
        }
      }
      else {
        message = `${fromPrice} ${selectedCurrency.name} equivalen a ${toPrice} Bs`;
      }

      await Share.share({ message });
    } catch (error) {
      console.log('Share error:', error);
      Toast.show("Ha habido un error tratando de compartir la información. Inténtalo nuevamente.", Toast.SHORT);
    }
  }

  const handleMenuToggle = (v: boolean) => {
    setIsMenuOpen(v)
  }

  const handleItemPress = (item: any) => {
    if (item.label == 'Compartir') {
      onShare()
    }

    if (item.label == 'Reiniciar') {
      onRefreshValues()
      setIsMenuOpen(false)
      Toast.show('Valores restablecidos', Toast.SHORT);
    }

    if (item.label == 'Refrescar') {
      onRefreshData()
      setIsMenuOpen(false)
    }
  }

  const renderItemIcon = (item: any) => {
    return <Lucide name={item.icon} color="#555555ff" size={25} />
  }

  const onPressMoneyChanger = () => {
    // Convierte los valores formateados de vuelta a números para el cálculo
    if (!isPressed) {
      setToPrice(toPrice);
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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <View style={styles.square}>
            {/* From Money container */}
            <Animated.View
              style={{ transform: [{ translateY: translateYFromPrice }] }}
            >
              <View>
                <View style={[styles.moneyContainer, { backgroundColor: isPressed ? '#dbdbdbff' : 'transparent' }]}>
                  {selectedCurrency.currency == 'BCV_USD' && <Image style={styles.currencyIcon} source={require('../assets/bcv.jpeg')} />}
                  {selectedCurrency.currency == 'BCV_EUR' && <Image style={styles.currencyIcon} source={require('../assets/euro.png')} />}
                  {selectedCurrency.currency == 'YD_USD' && <Image style={styles.currencyIcon} source={require('../assets/usdt.jpg')} />}
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
                      style={currency.currency == selectedCurrency.currency ? [styles.badge, styles.badgeBg] : styles.badge}
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
              style={{ transform: [{ translateY: translateYToPrice }] }}
            >
              <View style={[styles.moneyContainer, { backgroundColor: isPressed ? 'transparent' : '#ccc' }]}>
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
            <Animated.View style={{ transform: [{ translateY: translateYRefPrice }] }}>
              <Text style={[styles.textExample, { marginTop: isPressed ? 5 : 20 }]}>
                1 {selectedCurrency.name} = {selectedCurrency.rate} VES
              </Text>
            </Animated.View>

            <View style={{ marginTop: isPressed ? 40 : 20 }}>
              <Text>Última actualización: {formatDate(selectedCurrency.createdAt)}</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <FloatingMenu
        items={menuItems}
        isOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        onItemPress={handleItemPress}
        borderColor='#666666ff'
        bottom={30}
        right={20}
        backgroundDownColor='#d2d1d1ff'
        backgroundUpColor='#ffffff'
        dimmerStyle={{ backgroundColor: '#1c1c1caf' }}
        renderItemIcon={renderItemIcon}
        renderMenuIcon={() => <Lucide name='menu' size={25} />}
        primaryColor="#ffffff"
      />
    </View>
  );
}