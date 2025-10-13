'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show navbar on login and register pages only
  const hideNavbarPages = ['/login', '/register']
  
  if (hideNavbarPages.includes(pathname)) {
    return null
  }
  
  return <Navbar />
}