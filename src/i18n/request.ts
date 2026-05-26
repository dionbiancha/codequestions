// Placeholder — will be fully implemented in the i18n setup task
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  return {
    locale: 'en',
    messages: {},
  }
})
