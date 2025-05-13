"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

type KeywordProcessorProps = {
  onComplete?: () => void
  autoProcess?: boolean
}

export default function KeywordProcessor({ onComplete, autoProcess = true }: KeywordProcessorProps) {
  const [log, setLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Initialize Supabase client directly in the component
    const initializeSupabase = () => {
      try {
        // Get environment variables directly
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          logMessage("Error: Missing Supabase credentials")
          console.error("Missing Supabase credentials:", {
            urlAvailable: !!supabaseUrl,
            keyAvailable: !!supabaseKey,
          })
          return null
        }
        
        // Create client with explicit options
        const client = createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false, // Don't persist the session to avoid storage issues
            autoRefreshToken: false,
          }
        })
        
        logMessage("Supabase client initialized successfully")
        return client
      } catch (error) {
        logMessage(`Error initializing Supabase: ${error instanceof Error ? error.message : String(error)}`)
        console.error("Error initializing Supabase:", error)
        return null
      }
    }
    
    // Initialize client
    const client = initializeSupabase()
    setSupabase(client)
    
    // Auto-process if enabled and client is initialized
    if (autoProcess && client) {
      setTimeout(() => {
        processCapstoneItems(client)
      }, 1000)
    }
  }, [autoProcess])

  const logMessage = (msg: string) => {
    setLog((prev) => [...prev, msg])
    console.log(msg) // Also log to console for debugging
  }

  const sendKeywordMessage = async (userMessage: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    
    if (!apiKey) {
      logMessage("Error: API key not found")
      return ""
    }

    const context =
      "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. List them out in a bulleted format. Do not include any other message. You must only provide the keywords and nothing else."

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: context },
            { role: "user", content: userMessage },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      logMessage(`Error in sendKeywordMessage: ${error instanceof Error ? error.message : String(error)}`)
      return ""
    }
  }

  const convergeKeywords = async (pass1: string, pass2: string, pass3: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    
    if (!apiKey) {
      logMessage("Error: API key not found")
      return ""
    }

    const context =
      "You are a research assistant that is meant to gather the keywords most relevant to the project to be sent to you. These keywords should include the most important parts of the projects, as well as points of interest for any individual looking to search for references for their own project. You will be given a set of keywords that may or may not be duplicated. You must converge the similar items into one cohesive list. Reduce the amount of keywords to a sufficient amount. List them out in a CSV format. Do not include any other message. Avoid any and all use of parenthesis and other such symbols. You must only provide the keywords and nothing else."

    try {
      const userMessage = `${pass1}\n${pass2}\n${pass3}`
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: context },
            { role: "user", content: userMessage },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      logMessage(`Error in convergeKeywords: ${error instanceof Error ? error.message : String(error)}`)
      return ""
    }
  }

  // Modified to accept a client parameter
  const processCapstoneItems = async (client = supabase) => {
    if (!client) {
      logMessage("Error: Supabase client not initialized")
      console.error("Supabase client not initialized. Check your environment variables.")
      return
    }

    setLoading(true)
    setLog(["Starting keyword processing..."])

    try {
      logMessage("Querying for items without keywords...")
      
      // Create a mock item for testing if needed
      const mockItem = {
        id: 1,
        title: "Sample Academic Paper",
        abstract: "This is a sample abstract for testing the keyword processing functionality."
      }
      
      // Try to query Supabase
      try {
        const { data, error } = await client.from("capstones").select("id, title, abstract").is("keywords", null).limit(5)

        if (error) {
          throw new Error(`Error fetching items: ${error.message}`)
        }

        if (!data || data.length === 0) {
          //logMessage("No items found without keywords. Using mock data for testing.")
          // Use mock data for testing
          //await processSingleItem(client, mockItem)
        } else {
          logMessage(`Found ${data.length} items without keywords.`)
          // Process each item
          for (const item of data) {
            await processSingleItem(client, item)
          }
        }
      } catch (queryError) {
        logMessage(`Error querying database: ${queryError instanceof Error ? queryError.message : String(queryError)}`)
        //logMessage("Using mock data for testing.")
        // Use mock data for testing
        await processSingleItem(client, mockItem)
      }

      logMessage("All items processed successfully.")
    } catch (error) {
      logMessage(`Error processing capstone items: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
      if (onComplete) onComplete()
    }
  }
  
  // Helper function to process a single item
  const processSingleItem = async (client: any, item: any) => {
    const { id, title = "", abstract = "" } = item
    logMessage(`Processing item ID ${id}...`)

    if (!title && !abstract) {
      logMessage(`Item ${id} has no title or abstract. Skipping.`)
      return
    }

    const content = `Title: ${title}\n\nAbstract: ${abstract}`

    logMessage(`Generating keywords for item ${id}...`)
    const pass1 = await sendKeywordMessage(content)
    const pass2 = await sendKeywordMessage(content)
    const pass3 = await sendKeywordMessage(content)

    const keywords = await convergeKeywords(pass1, pass2, pass3)

    if (!keywords) {
      logMessage(`Failed to generate keywords for item ${id}.`)
      return
    }

    const keywordsList = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
    logMessage(`Generated ${keywordsList.length} keywords for item ${id}.`)

    try {
      const { error: updateError } = await client
        .from("capstones")
        .update({ keywords: keywordsList })
        .eq("id", id)

      if (updateError) {
        throw new Error(`Error updating item ${id}: ${updateError.message}`)
      }

      logMessage(`Successfully updated item ${id}.`)
    } catch (updateError) {
      logMessage(
        `Error updating item ${id}: ${updateError instanceof Error ? updateError.message : String(updateError)}`
      )
    }
  }

  // Function to manually initialize Supabase
  const manualInitialize = () => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )
    setSupabase(client)
    logMessage("Manually initialized Supabase client")
    return client
  }

  return (
    <div className="p-4">
      {loading && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
          <span className="text-blue-600 font-medium">Processing keywords automatically...</span>
        </div>
      )}

      {!loading && !supabase && (
        <button
          onClick={() => {
            const client = manualInitialize()
            setTimeout(() => processCapstoneItems(client), 500)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Initialize and Process
        </button>
      )}

      <div className="mt-4 bg-gray-100 p-3 rounded shadow-sm max-h-[300px] overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-sm text-gray-500">Processing logs will appear here...</p>
        ) : (
          log.map((msg, idx) => (
            <p key={idx} className="text-sm font-mono">
              {msg}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
