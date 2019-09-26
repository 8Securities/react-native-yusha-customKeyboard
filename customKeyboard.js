
import React from 'react';
import {
  Platform,
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
  AppState,
  Dimensions,
} from 'react-native';
import CustomKeyboardView from './CustomKeyboardView'
import { 
  addKeyboardHideListener,
  addKeyboardShowListener,
  removeKeyboardListener,
} from './keyboardEvents';

const { CustomKeyboard } = NativeModules;

const {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  clearAll, keyboardHeight
} = CustomKeyboard;

export {
  install, uninstall,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
  clearAll,
};

const keyboardTypeRegistry = {};

export const register = (type, factory) => {
  keyboardTypeRegistry[type] = factory;
};

export const clearFocus = (tag) => {
  TextInput.State.blurTextInput(tag);
};

const CustomKeyboardContainer = ({ tag, type, ...rest }) => {
  const factory = keyboardTypeRegistry[type];

  if (!factory) {
    console.warn(`Custom keyboard type (${type}) not registered.`);
    return null;
  }

  const Comp = factory();

  return <Comp tag={tag} />;
}
AppRegistry.registerComponent('CustomKeyboard', () => CustomKeyboardContainer);

export class CustomTextInput extends React.Component {
  state = {
    text: this.props.defaultValue || '',
  };

  componentDidMount() {
    if (this.props.customKeyboardType) {
      this.installTime = setTimeout(() => {
        install(findNodeHandle(this.input), this.props.customKeyboardType);

        // if (Platform.OS === 'android') {
        //   this.showSub = addKeyboardShowListener(this.showKeyboard);
        //   this.hideSub = addKeyboardHideListener(this.hideKeyboard);
        // }

        if (this.props.autoFocus) {
          TextInput.State.focusTextInput(findNodeHandle(this.input));
        }

        AppState.addEventListener('change', this.handleAppStateChange);
      }, 300)
    }
  }

  componentWillUnmount() {
    this.showSub && removeKeyboardListener(this.showSub);
    this.hideSub && removeKeyboardListener(this.hideSub);
    this.installTime && clearTimeout(this.installTime)
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.customKeyboardType !== this.props.customKeyboardType) {
      install(findNodeHandle(this.input), newProps.customKeyboardType);
    }

    if (newProps.value !== null && newProps.value !== undefined && newProps.value !== this.state.text) {
      this.setState({ text: newProps.value });
    }
  }

  handleAppStateChange = (nextAppState) => {
    // Check keyboard
    if (nextAppState === 'background' && TextInput.State.currentlyFocusedField() === findNodeHandle(this.input)) {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
      return true;
    }
  }

  showKeyboard = (data) => {
    if (!data || !data.tag || data.tag !== findNodeHandle(this.input)){
      return;
    }

    this.props.onFocus && this.props.onFocus();
  }

  hideKeyboard = (data) => {
    if (data && data.tag !== findNodeHandle(this.input)) {
      return;
    }

    this.props.onBlur && this.props.onBlur();

    if (this.props.onEndEditing) {
      this.props.onEndEditing({ nativeEvent: { text: this.state.text } });
    }
  }

  onRef = ref => {
    this.input = ref;
    this.props.textInputRef && this.props.textInputRef(ref)
  };

  render() {
    const { customKeyboardType, autoFocus, ...others } = this.props;

    if (!customKeyboardType) {
      return (
        <TextInput {...others} />
      );
    }

    return (
      <TextInput {...others}
        ref={this.onRef}
        onChangeText={this.props.onChangeText}
        value={this.props.value}
      />
    );
  }
}

export function keyBoardAPI(keyboardName, KeyboardView) {
  class KeyBoard extends React.Component {
    render() {
      return (
        <CustomKeyboardView
          insertText={insertText}
          clearFocus={clearFocus}
          clearAll={clearAll}
          backSpace={backSpace}
          keyboardContainerHeight={keyboardHeight}
          keyboardViewHeight={Platform.OS === 'ios' ? 252 : 306}
          KeyboardView={KeyboardView}
          {...this.props}
        />
      );
    }
  }

  register(keyboardName, () => KeyBoard);

  return KeyBoard;
}