import React from 'react';
import { StyleSheet, ImageBackground, Text, View, Image, Animated,ToastAndroid, Platform} from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../../screens/Home';
import { fetchDollarPrice, getActualRates } from '../../api/dollar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorComponent from './Error';

function AppContent() {
  // const safeAreaInsets = useSafeAreaInsets();
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
  const queryClient = useQueryClient();
  const opacity = React.useRef(new Animated.Value(1)).current;
  const animationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  // Queries
  let { data, isLoading, error } = useQuery({ 
    queryKey: ['rates'], 
    queryFn: fetchDollarPrice
  })

  // Mutations
  const mutation = useMutation({
    mutationFn: getActualRates,
    onSuccess: (res) => {
      queryClient.setQueryData(['rates'], res.rates);

      if(Platform.OS === 'android') {
        ToastAndroid.show('Las tarifas se han actualizado.', ToastAndroid.SHORT);
      }
    },
    onError: (error) => {

    }
  });
  
  // Animación fadeIn/fadeOut en loop mientras isLoading
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

  // Ejecuta la mutacion que trae los rates actualizados
  const onRefreshData = () => {
    mutation.mutate();
  }

  if(error) {
    return <ErrorComponent onRefreshData={onRefreshData} />
  }

  if(isLoading || mutation.isPending) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: opacity }}>
          <Image style={styles.loaderImage} source={require('../../assets/logo.png')} />
        </Animated.View>
      </View>
    )
  }

  return (
    <ImageBackground 
      source={ramndomImage} 
      resizeMode="cover"
      style={styles.container}
    >
      <Home rates={data} onRefreshData={onRefreshData} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#faf7ed',
  },
  loaderImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});

export default AppContent;