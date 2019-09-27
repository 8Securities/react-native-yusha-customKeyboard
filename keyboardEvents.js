import {
  Keyboard,
  Platform,
  NativeAppEventEmitter,
} from 'react-native';

export const addKeyboardShowListener = (listener) => {
  if (Platform.OS === 'android') {
    return NativeAppEventEmitter.addListener('keyboardDidShow', (data) => {
      listener(data);
    })
  } else {
    Keyboard.addListener('keyboardDidShow', (data) => {
      listener(data);
    });

    return 'keyboardDidShow';
  }
};

export const addKeyboardHideListener = (listener) => {
  if (Platform.OS === 'android') {
    NativeAppEventEmitter.addListener('keyboardDidHide', (data) => {
      listener(data);
    });
  } else {
    Keyboard.addListener('keyboardDidHide', (data) => {
      listener(data);
    });
  }
};

export const removeKeyboardListener = (subscription) => {
  if (Platform.OS === 'android') {
    NativeAppEventEmitter.removeSubscription(subscription);
  } else {
    Keyboard.removeListener(subscription);
  }
};