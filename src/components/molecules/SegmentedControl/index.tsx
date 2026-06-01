import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useTheme } from '../../../theme'
import { makeStyles } from './styles'

type Tab = {
  label: string
  value: string
}

type SegmentedControlProps = {
  tabs: Tab[]
  active: string
  onChange: (value: string) => void
}

export function SegmentedControl({ tabs, active, onChange }: SegmentedControlProps) {
  const { colors } = useTheme()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.value === active
        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onChange(tab.value)}
          >
            <Text style={isActive ? styles.labelActive : styles.labelInactive}>{tab.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
