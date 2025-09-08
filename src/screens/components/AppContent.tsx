import React from 'react';
import { StyleSheet, ImageBackground, Text, View } from 'react-native';
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

  const randomIndex = Math.floor(Math.random() * images.length);
  const ramndomImage = images[randomIndex];

  const {data, error, isLoading} = useQuery({
    queryKey: ['dollarPrice'],
    queryFn: fetchDollarPrice,
  });

  if(error) {
    console.error('Error fetching dollar price:', error);
    <Text>Huvo un error {JSON.stringify(error, null, 4)}</Text>
    return;
  }

  if(data) {
    console.log('Data fetched:', data);
    // setDataTest(data);
  }

  if(isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading</Text>
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
  },
});

export default AppContent;