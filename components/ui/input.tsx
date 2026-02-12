import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  showSearchIcon?: boolean;
}

export default function Input({
  label,
  containerStyle,
  style,
  showSearchIcon = false,
  value,
  onChangeText,
  ...props
}: InputProps) {
  const showClearButton = !!value;

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {showSearchIcon && (
          <Ionicons
            name="search"
            size={18}
            color="#666"
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            showSearchIcon && styles.inputWithLeftIcon,
            showClearButton && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {showClearButton && (
          <Pressable
            onPress={() => onChangeText?.('')}
            style={styles.clearButton}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={18} color="#666" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#e6e6e6',
  },
  leftIcon: {
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  inputWithLeftIcon: {
    paddingLeft: 6,
  },
  inputWithRightIcon: {
    paddingRight: 6,
  },
  clearButton: {
    paddingRight: 10,
  },
});
