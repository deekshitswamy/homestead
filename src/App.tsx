import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Budget from '@layout/Budget.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Budget/>   
    </>
  )
}

export default App
