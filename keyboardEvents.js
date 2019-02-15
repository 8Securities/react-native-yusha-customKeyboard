import {
  Keyboard,
  Platform,
  NativeAppEventEmitter,
} from 'react-native';

export const addKeyboardShowListener = (listener) => {
  if (Platform.OS === 'android') {
    return NativeAppEventEmitter.addListener('showCustomKeyboard', (data) => {
      listener(data);
    })
  } else {
    Keyboard.addListener('keyboardDidShow', () => listener());

    return 'keyboardDidShow';
  }
};

export const addKeyboardHideListener = (listener) => {
  if (Platform.OS === 'android') {
    return NativeAppEventEmitter.addListener('hideCustomKeyboard', (data) => {
      listener(data);
    })
  } else {
    Keyboard.addListener('keyboardDidHide', () => {
      listener();
    });

    return 'keyboardDidHide';
  }
};

export const removeKeyboardListener = (subscription) => {
  if (Platform.OS === 'android') {
    NativeAppEventEmitter.removeSubscription(subscription);
  } else {
    Keyboard.removeListener(subscription);
  }
};