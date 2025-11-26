import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4CAF50', // Verde (comida/saudável)
          secondary: '#FF9800', // Laranja (energia/culinária)
          background: '#F5F5F5', // Cinza claro
          surface: '#FFFFFF', // Branco
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#424242', // Cinza escuro
        },
      },
    },
  },
})
