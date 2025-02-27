"use server"

// Update the scanMedicine function to handle FormData
export async function scanMedicine(prevState: any, formData: FormData) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/disposal/scan"

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // For demo purposes, we'll simulate a response
    // In a real app, this would come from your backend
    const randomCategory = Math.floor(Math.random() * 3)
    const disposalMethods = ["Recycle", "Pharmacy Drop-Off", "Hazardous Waste"]

    return {
      success: true,
      data: {
        category: randomCategory,
        method: disposalMethods[randomCategory],
      },
    }
  } catch (error: any) {
    console.error("Error in scanMedicine:", error)
    return {
      success: false,
      error: error.message || "Failed to scan medicine",
    }
  }
}

