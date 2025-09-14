import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  square: {
    width: windowWidth * 0.9,
    borderWidth: 1,
    borderColor: '#666666ff',
    borderRadius: 20,
    alignItems: 'center',
    height: 400,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffffc7',
  },
  moneyContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth * 0.9 - 40,
    height: 70,
    borderWidth: 1,
    borderColor: '#666666ff',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#dededeff',
  },
  circleChanger: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#666666ff',
    borderRadius: 50,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textExample: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    width: 80,
    height: 25,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#909090ff',
  },
  badgeBg: {
    backgroundColor: '#f43737ff',
  },
  badgeText: {
    color: '#fff',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 40,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    width: windowWidth * 0.9 - 110,
    textAlign: 'right',
  },
  currencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  buttons: {
    alignSelf: 'flex-end',
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666666ff',
    backgroundColor: '#ffffffc7',
    borderRadius: 5
  },
  reloadButton: {
    backgroundColor: '#ffe415ff',
    borderWidth: 1,
    borderColor: '#fff700ff',
    padding: 5,
    borderRadius: 5,
    width: 100,
    alignItems: 'center'
  },
  textErrContainer: {
    width: '90%',
    padding: 20,
    paddingVertical: 50,
    alignItems: 'center',
    backgroundColor: '#252525c0',
    borderRadius: 20
  },
  textErr: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
  }
});

export default styles;