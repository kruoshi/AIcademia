"use client"

import { useEffect, useState } from "react"

export default function EnvDebug() {
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({})

  useEffect(() => {
    // Check which environment variables are available in the client
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
      NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    })
  }, [])

  return (
    <div className="p-4 mt-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Environment Variables Debug</h2>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="font-mono text-sm">{key}:</span>
            <span className="ml-2 font-mono text-sm">{value ? "✅ Available" : "❌ Not available"}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Make sure all required environment variables are set in your .env.local file or in your deployment environment.
      </p>
    </div>
  )
}
