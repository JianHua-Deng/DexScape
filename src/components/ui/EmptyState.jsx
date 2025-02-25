import { useThemeProvider } from "../../lib/ThemeContextProvider"

export default function EmptyState({ titleTextContent, textContent }) {

  const { theme } = useThemeProvider();

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg ${
      theme === 'dark' ? 'bg-lightDark' : 'bg-gray-200'
    }`}>
      <h2 className={`text-xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-lightText' : 'text-darkText'
      }`}>
        {titleTextContent}
      </h2>
      <p className={`text-center ${
        theme === 'dark' ? 'text-lightText/70' : 'text-darkText/70'
      }`}>
        {textContent}
      </p>
    </div>
  )
}