import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body || !body.userProfile || !body.requestType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { userProfile, requestType } = body;

    let prompt = "";
    if (requestType === "resources") {
      prompt = `As an AI study advisor, provide personalized learning resource recommendations for a South African university student with the following profile:
        University: ${userProfile.university}
        Faculty: ${userProfile.faculty}
        Department: ${userProfile.department}
        Courses: ${userProfile.courses}
        Interests: ${userProfile.interests}
        Learning Style: ${userProfile.learningStyle}
        
        Provide your response in valid JSON format with the following structure:
        {
          "resources": [
            {
              "title": "Resource Title",
              "type": "Book/Article/Video/etc.",
              "relevance": 95,
              "university": "Relevant South African University"
            }
          ]
        }`;
    } else if (requestType === "studyTips") {
      prompt = `As an AI study advisor, provide personalized study tips for a South African university student with the following profile:
        University: ${userProfile.university}
        Faculty: ${userProfile.faculty}
        Department: ${userProfile.department}
        Courses: ${userProfile.courses}
        Interests: ${userProfile.interests}
        Learning Style: ${userProfile.learningStyle}
        
        Provide your response in valid JSON format with the following structure:
        {
          "studyTips": [
            {
              "tip": "Study tip content",
              "category": "Time Management/Note-taking/etc."
            }
          ]
        }`;
    } else if (requestType === "mentors") {
      prompt = `As an AI study advisor, recommend mentors for a South African university student with the following profile:
        University: ${userProfile.university}
        Faculty: ${userProfile.faculty}
        Department: ${userProfile.department}
        Courses: ${userProfile.courses}
        Interests: ${userProfile.interests}
        Learning Style: ${userProfile.learningStyle}
        
        Provide your response in valid JSON format with the following structure:
        {
          "mentors": [
            {
              "name": "Mentor Name",
              "expertise": "Area of Expertise",
              "university": "South African University",
              "rating": 4.5
            }
          ]
        }`;
    } else {
      return NextResponse.json(
        { error: "Invalid recommendation type" },
        { status: 400 }
      );
    }

    const aiResponse = await generateAIResponse(prompt);
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("Invalid AI response format");
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error in AI recommendations:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

