import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  DeviceInfo,
} from 'react-native';

class CustomKeyboardView extends React.Component {
  state;
  backSpaceRequest;
  insertTextRequest;
  clearFocusRequest;
  clearAllRequest;

  state = {
    width: 0,
  };

  handleDelete = () => {
    this.backSpaceRequest && cancelAnimationFrame(this.backSpaceRequest);
    
    this.backSpaceRequest = requestAnimationFrame(() => {
      this.props.backSpace(this.props.tag);
    });
  };

  handleKeyPress = (key) => {
    this.insertTextRequest && cancelAnimationFrame(this.insertTextRequest);
    this.insertTextRequest = requestAnimationFrame(() => {
      this.props.insertText(this.props.tag, key);
    });
  };

  clearFocus = () => {
    this.clearFocusRequest && cancelAnimationFrame(this.clearFocusRequest);

    this.clearFocusRequest = requestAnimationFrame(() => {
        this.props.clearFocus(this.props.tag);
    });
  };

  handleClearAll = () => {
    this.clearAllRequest && cancelAnimationFrame(this.clearAllRequest);
    
    this.clearAllRequest = requestAnimationFrame(() => {
        this.props.clearAll(this.props.tag);
    });
  };

  onLayout = ({ nativeEvent }) => {
    const width = nativeEvent.layout.width;

    if (width > 0 && width !== this.state.width) {
      this.setState({ width });
    }
  };

  componentWillUnmount() {
    this.clearFocusRequest && cancelAnimationFrame(this.clearFocusRequest);
    this.insertTextRequest && cancelAnimationFrame(this.insertTextRequest);
    this.backSpaceRequest && cancelAnimationFrame(this.backSpaceRequest);
    this.clearAllRequest && cancelAnimationFrame(this.clearAllRequest);
  };

  render() {
    const { KeyboardView } = this.props;

    return (
      <View onLayout={this.onLayout} style={styles.container} ref="keyboard" pointerEvents="box-none">
        <View style={styles.keyboard} key="keyboard">
          {!KeyboardView.customKeyboardTop && (
            <View style={styles.top}>
              <View style={styles.topLeft}>
                {KeyboardView.getKeyBoardIcon && KeyboardView.getKeyBoardIcon()}
                <Text style={styles.topDesText}>{KeyboardView.getKeyBoardName && KeyboardView.getKeyBoardName()}</Text>
              </View>

              <TouchableOpacity onPress={this.clearFocus}>
                <Text style={styles.topCompleteText}>完成</Text>
              </TouchableOpacity>
            </View>
          )}

          <KeyboardView
            {...this.props}
            onKeyPress={this.handleKeyPress}
            onDelete={this.handleDelete}
            onClearAll={this.handleClearAll}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  keyboard: {
    backgroundColor: '#f6f5f2',
    height: DeviceInfo.isIPhoneX_deprecated ? 286 : 252,
  },
  top: {
    height: 36,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#a5a5a5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
  },
  topDesText: {
    color: '#adadad',
    fontSize: 15,
    paddingHorizontal: 8,
  },
  topCompleteText: {
    color: '#0297fa',
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default CustomKeyboardView;
