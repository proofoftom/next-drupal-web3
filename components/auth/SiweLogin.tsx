"use client"

import { useState, useEffect } from "react"
import { SiweMessage } from "siwe"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function SiweLogin() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    setMounted(true)

    // Check if user is already logged in
    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")
    if (accessToken && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature")
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const userAddress = accounts[0]
      setAddress(userAddress)

      // Convert address to checksum format
      const checksumAddress = ethers.getAddress(userAddress)

      // Lookup ENS name
      const provider = new ethers.BrowserProvider(window.ethereum)
      let ensName = await provider.lookupAddress(userAddress)

      // Always verify the forward resolution
      if (ensName) {
        const resolvedAddress = await provider.resolveName(ensName)
        if (resolvedAddress !== checksumAddress) {
          // If verification fails, reset to null
          ensName = null
        }
      }

      // Get nonce from Drupal
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/siwe/nonce`
      )
      const { nonce } = await nonceRes.json()

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: checksumAddress,
        statement: "Sign in with Ethereum to access your account",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
        nonce,
        ...(ensName && { resources: [`ens:${ensName}`] }), // Format as ENS URI
      })

      const preparedMessage = message.prepareMessage()

      // Sign message
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(preparedMessage)

      // Authenticate with Drupal
      const authRes = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/siwe/auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: preparedMessage,
            signature,
            address: checksumAddress,
            nonce,
          }),
        }
      )

      const authData = await authRes.json()

      if (authData.access_token) {
        // Store tokens and user data
        localStorage.setItem("access_token", authData.access_token)
        // Optionally store refresh token if your backend provides one
        // localStorage.setItem('refresh_token', authData.refresh_token)
        localStorage.setItem("user", JSON.stringify(authData.user))

        setUser(authData.user)
      } else {
        alert("Authentication failed: " + (authData.error || "Unknown error"))
      }
    } catch (error: unknown) {
      console.error("SIWE authentication failed:", error)
      if (error instanceof Error) {
        alert("SIWE authentication failed: " + error.message)
      } else {
        alert("SIWE authentication failed")
      }
    }
  }

  const handleLogout = async () => {
    try {
      // Logout from Drupal (with JWT-based auth, this might not be necessary)
      // await fetch(
      //   `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/siwe/logout`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // )

      // Clear local storage
      localStorage.removeItem("access_token")
      // localStorage.removeItem('refresh_token')
      localStorage.removeItem("user")

      setUser(null)
      setAddress("")
    } catch (error: unknown) {
      console.error("Logout failed:", error)
      if (error instanceof Error) {
        alert("Logout failed: " + error.message)
      } else {
        alert("Logout failed")
      }
    }
  }

  if (!mounted) return null

  return (
    <div>
      {user ? (
        <div>
          <span>Logged in as {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign in with Ethereum</button>
      )}
    </div>
  )
}
