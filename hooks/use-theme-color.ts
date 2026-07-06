

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName?: string
): string {
  // L'app usa sempre il tema dark, restituiamo il colore da props se fornito
  const colorFromProps = props.dark ?? props.light;
  return colorFromProps ?? Colors.textPrimary;
}
