import { StyleSheet, TextInput } from 'react-native';

interface TextareaProps {
  onChangeText?: (text: string) => void;
  value?: string;
  editable?: boolean;
  onFocus?: () => void;
  placeholder?: string;
}

export default function Textarea({
  onChangeText,
  value,
  editable,
  onFocus,
  placeholder = '리뷰를 작성해주세요',
}: TextareaProps) {
  return (
    <TextInput
      style={styles.reviewInput}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline
      placeholder={placeholder}
      onFocus={onFocus}
    />
  );
}

const styles = StyleSheet.create({
  reviewInput: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
