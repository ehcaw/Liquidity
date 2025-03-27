import Groq from "groq-sdk";
import z from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const CheckScanSchema = z.object({
  check_or_not: z
    .boolean()
    .describe("Whether the image contains a valid check"),
  name: z
    .string()
    .optional()
    .describe("Name of the person/entity on the check"),
  amount: z.number().optional().describe("Numerical amount on the check"),
  date: z.string().optional().describe("Date written on the check"),
});
export async function POST(req: Request) {
  const { url } = await req.json();
  const prompt = `Analyze this image and determine if it contains a valid check/cheque.

If it is a check, extract the following information:
1. The name on the check (payee)
2. The amount (numeric value only, e.g., 123.45)
3. The date (formatted as string)

If it is NOT a check or the image quality is too poor to determine, just indicate that.

Return your response in this exact JSON format:
{
  "check_or_not": boolean,
  "name": string or null if not a check,
  "amount": number or null if not a check,
  "date": string or null if not a check
}`;
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
      },
    ],
    model: "llama-3.2-90b-vision-preview",
    temperature: 0.2,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    stop: null,
    response_format: {
      type: "json_object",
    },
  });

  try {
    // Parse the JSON string from the model's response
    const jsonResponse = JSON.parse(
      response.choices[0].message.content || "{}",
    );

    // Validate with Zod schema
    const validated = CheckScanSchema.parse(jsonResponse);

    console.log("Validated check data:", validated);
    return Response.json({ data: validated }, { status: 200 });
  } catch (error) {
    console.error("Error parsing response:", error);
    return Response.json(
      {
        error: "Failed to parse check data",
        rawContent: response.choices[0].message.content,
      },
      { status: 422 },
    );
  }
}
