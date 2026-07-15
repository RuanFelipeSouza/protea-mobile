import { Image, type StyleProp, type ImageStyle } from 'react-native'

const MARK = require('../../../../assets/images/protea-mark.png')

type ProteaMarkProps = {
  size?: number
  style?: StyleProp<ImageStyle>
}

/** Ícone de marca da Protea (recorte do app icon, cantos transparentes). Cores fixas — não aceita `color`. */
export function ProteaMark({ size = 44, style }: ProteaMarkProps) {
  return (
    <Image
      source={MARK}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  )
}
