import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { StyleProp, type TextStyle } from 'react-native';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({ name, size = 24, color, style }: IconProps) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={name}
      style={style}
    />
  );
}
