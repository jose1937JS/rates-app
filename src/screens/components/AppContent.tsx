import React from 'react';
import { StyleSheet, ImageBackground, Text, View, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../../screens/Home';
import { fetchDollarPrice } from '../../api/dollar';
import { useQuery } from '@tanstack/react-query';

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const images = [
    require('../../assets/bg/indra-jaya-cGZVlXFRaqY-unsplash.jpg'),
    require('../../assets/bg/zeq-qayong-0Q96h2BbjgY-unsplash.jpg'),
    require('../../assets/bg/goutham-krishna-h5wvMCdOV3w-unsplash.jpg'),
    require('../../assets/bg/ian-dooley-TLD6iCOlyb0-unsplash.jpg'),
    require('../../assets/bg/jaid-khan-PlUjHWlZUZ0-unsplash.jpg'),
    require('../../assets/bg/pawel-czerwinski-6lQDFGOB1iw-unsplash.jpg'),
    require('../../assets/bg/shifaaz-shamoon-sLAk1guBG90-unsplash.jpg'),
    require('../../assets/bg/venti-views-KAyZPC_Q5YM-unsplash.jpg'),
    require('../../assets/bg/warren-bh4LQHcOcxE-unsplash.jpg'),
  ];

  const opacity = React.useRef(new Animated.Value(1)).current;
  const animationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  // Animación fadeIn/fadeOut en loop mientras isLoading
  const {data, error, isLoading} = useQuery({
    queryKey: ['dollarPrice'],
    queryFn: fetchDollarPrice,
  });
  
  React.useEffect(() => {
    if (isLoading) {
      opacity.setValue(0);
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();
    } else {
      // Detener animación y dejar opacidad en 1
      if (animationRef.current) {
        animationRef.current.stop();
      }
      opacity.setValue(1);
    }
    // cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isLoading, opacity]);


  // Select a random image from the array
  const randomIndex = Math.floor(Math.random() * images.length);
  const ramndomImage = images[randomIndex];

  if(error) {
    console.error('Error fetching dollar price:', error);
    <Text>Huvo un error {JSON.stringify(error, null, 4)}</Text>
    return;
  }

  if(isLoading) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: opacity }}>
          <Image style={styles.loaderImage} source={require('../../assets/logo.png')} />
        </Animated.View>
      </View>
    )
  }

  return (
    <ImageBackground source={ramndomImage} resizeMode="cover"
      style={[
        styles.container, 
        { 
          padding: 10,
          paddingTop: safeAreaInsets.top,
        }
      ]}
    >
      <Home rates={data} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loaderImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});

export default AppContent;