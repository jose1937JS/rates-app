import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, ImageBackground } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import Home from './src/screens/Home';
import {
  QueryClient,
  useQuery,
  QueryClientProvider,
} from '@tanstack/react-query'
import { fetchDollarPrice } from './src/api/dollar';

const queryClient = new QueryClient()

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const images = [
    require('./src/assets/bg/indra-jaya-cGZVlXFRaqY-unsplash.jpg'),
    require('./src/assets/bg/zeq-qayong-0Q96h2BbjgY-unsplash.jpg'),
    require('./src/assets/bg/goutham-krishna-h5wvMCdOV3w-unsplash.jpg'),
    require('./src/assets/bg/ian-dooley-TLD6iCOlyb0-unsplash.jpg'),
    require('./src/assets/bg/jaid-khan-PlUjHWlZUZ0-unsplash.jpg'),
    require('./src/assets/bg/pawel-czerwinski-6lQDFGOB1iw-unsplash.jpg'),
    require('./src/assets/bg/shifaaz-shamoon-sLAk1guBG90-unsplash.jpg'),
    require('./src/assets/bg/venti-views-KAyZPC_Q5YM-unsplash.jpg'),
    require('./src/assets/bg/warren-bh4LQHcOcxE-unsplash.jpg'),
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  const ramndomImage = images[randomIndex];

  const [dataTest, setDataTest] = useState<any>(null);

  const {data, error, isLoading} = useQuery({
    queryKey: ['dollarPrice'],
    queryFn: fetchDollarPrice,
  });

  if(isLoading) {
    console.log('Loading...');
  }

  if(error) {
    console.error('Error fetching dollar price:', error);
    return;
  }

  if(data) {
    console.log('Data fetched:', data);
    // setDataTest(data);
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
      <Home />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
