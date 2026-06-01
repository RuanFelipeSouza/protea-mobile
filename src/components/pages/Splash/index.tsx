import { useEffect, useRef } from 'react'
import { ActivityIndicator, Animated, Easing, Image, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../../theme/colors'
import { makeStyles } from './styles'

const LOGO = require('../../../../assets/images/protea-logo.png')

const styles = makeStyles(colors)

export function SplashScreen() {
  const insets = useSafeAreaInsets()
  const logoAnim = useRef(new Animated.Value(0)).current
  const sloganAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(sloganAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start()
  }, [logoAnim, sloganAnim])

  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
      },
    ],
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animStyle(logoAnim)]}>
        {LOGO ? (
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]} />
        )}
      </Animated.View>

      <Animated.View style={animStyle(sloganAnim)}>
        <Text style={styles.slogan}>
          Cuidado que <Text style={styles.sloganBold}>acolhe</Text>.{'\n'}
          Tecnologia que <Text style={styles.sloganBold}>transforma</Text>.
        </Text>
      </Animated.View>

      <View style={[styles.spinnerWrap, { bottom: insets.bottom + 56 }]}>
        <ActivityIndicator size="large" color={colors.primary[70]} />
      </View>
    </View>
  )
}
