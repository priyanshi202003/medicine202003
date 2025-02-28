import { NextResponse } from "next/server"
import axios from "axios"

const DAILYMED_API = "https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json"
const RXNORM_API = "https://rxnav.nlm.nih.gov/REST/drugs.json?name="

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const medicineName = searchParams.get("name")

  if (!medicineName) {
    return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
  }

  try {
    // Fetch medicine info from multiple sources
    const [dailyMedResponse, rxnormResponse] = await Promise.all([
      axios.get(DAILYMED_API),
      axios.get(`${RXNORM_API}${medicineName}`),
    ])

    const disposalInfo = dailyMedResponse.data.data?.find(
      (drug: any) => drug.drug_name.toLowerCase() === medicineName.toLowerCase(),
    )

    const rxnormInfo = rxnormResponse.data.drugGroup?.conceptGroup

    return NextResponse.json({
      name: medicineName,
      disposal: disposalInfo?.disposal_info || "Check local guidelines for proper disposal",
      recyclable: rxnormInfo ? "Check local guidelines for proper disposal" : "No data available",
      details: disposalInfo || {},
      rxnormData: rxnormInfo || [],
    })
  } catch (error) {
    console.error("Error fetching medicine info:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information" }, { status: 500 })
  }
}

