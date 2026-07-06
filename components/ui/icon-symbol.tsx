// Fallback per l'utilizzo di MaterialIcons su Android e web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Aggiungiamo le mappature tra SF Symbols e Material Icons.
 * - Material Icons nella [Icons Directory](https://icons.expo.fyi).
 * - SF Symbols nell'app [SF Symbols](https://developer.apple.com/sf-symbols/).
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * Un'icona che utilizza SF Symbols nativi su iOS e Material Icons su Android e web.
 * Ciò garantisce un aspetto coerente tra le diverse piattaforme e un utilizzo ottimale delle risorse.
 * I nomi delle icone si basano su SF Symbols e richiedono una mappatura manuale verso Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
