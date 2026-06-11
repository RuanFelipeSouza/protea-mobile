import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useTheme } from '../../../theme'

type Props = {
  html: string
}

const HEIGHT_REPORTER = `
  (function () {
    function report() {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(String(height));
    }
    window.addEventListener('load', report);
    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    setTimeout(report, 100);
    setTimeout(report, 500);
    true;
  })();
`

export function HtmlContent({ html }: Props) {
  const { colors, dark } = useTheme()
  const [height, setHeight] = useState(80)

  const source = useMemo(() => {
    const document = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              background: transparent;
              color: ${colors.neutral[80]};
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              line-height: 1.55;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            p { margin: 0 0 10px 0; }
            p:last-child { margin-bottom: 0; }
            strong, b { font-weight: 600; color: ${colors.neutral[90]}; }
            em, i { font-style: italic; }
            u { text-decoration: underline; }
            a { color: ${colors.primary[70]}; }
            ul, ol { padding-left: 20px; margin: 0 0 10px 0; }
            li { margin-bottom: 4px; }
            .ql-align-justify { text-align: justify; }
            .ql-align-center { text-align: center; }
            .ql-align-right { text-align: right; }
            img { max-width: 100%; height: auto; }
            blockquote {
              border-left: 3px solid ${colors.primary[60]};
              padding-left: 10px;
              margin: 0 0 10px 0;
              color: ${colors.neutral[70]};
            }
          </style>
        </head>
        <body>${html ?? ''}</body>
      </html>
    `
    return { html: document }
  }, [html, colors, dark])

  return (
    <View style={[styles.wrapper, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={source}
        injectedJavaScript={HEIGHT_REPORTER}
        onMessage={(event) => {
          const value = Number(event.nativeEvent.data)
          if (!Number.isNaN(value) && value > 0) {
            setHeight(value)
          }
        }}
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
        backgroundColor="transparent"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
