import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini features may fail.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

/**
 * POST /api/chat
 * Multi-turn Gemini chatbot with Google Search Grounding
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, siteContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getAI();

    // System instruction establishing persona and real estate intelligence
    const systemInstruction = `You are the EEstates AI Senior Real Estate Advisor & Market Analyst, developed for EEstates Agency (Developed by Krishna).
Agency Headquarters: 568 narayan circle, bharatpur, Rajasthan, 321001.
Contact Email: krishnaagr047@gmail.com
Master Admin & Lead Architect: Krishna (krishna7073817925@gmail.com).

Your responsibilities:
1. Provide expert real estate advisory, property valuation analysis, market comparisons, mortgage estimations, and architectural guidance.
2. When asked about properties, market prices, regional development (e.g. Bharatpur, Rajasthan, NCR, and international luxury hubs), use real-time Google Search data to deliver factual, up-to-date information.
3. Assist visitors and administrators (Krishna) in drafting real estate reports, investment feasibility studies, and tenant/host evaluations.
4. Maintain a warm, authoritative, and sophisticated tone. Format responses with clear headings, bullet points, and highlight key metrics.
5. If discussing platform properties, reference the live agency data provided in context.

Current Platform Context:
${siteContext ? JSON.stringify(siteContext).slice(0, 3000) : 'EEstates Luxury Agency catalog active.'}`;

    // Format message history for @google/genai
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Use gemini-3.5-flash with googleSearch tool for search grounding as requested
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      }
    });

    const candidate = response.candidates?.[0];
    const text = response.text || candidate?.content?.parts?.[0]?.text || 'No response generated.';

    // Extract search grounding sources if present
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources: { title: string; url: string }[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          url: chunk.web.uri
        });
      }
    });

    const searchQueries = candidate?.groundingMetadata?.webSearchQueries || [];

    return res.json({
      text,
      sources,
      searchQueries
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI chat request',
      fallbackText: 'I apologize, but I encountered an error communicating with the AI service. Please verify your GEMINI_API_KEY or try again shortly.'
    });
  }
});

/**
 * POST /api/reports/generate
 * Generates in-depth real estate valuation, market trend, and agency executive reports
 * Uses Google Search Grounding for current market accuracy.
 */
app.post('/api/reports/generate', async (req: Request, res: Response) => {
  try {
    const { reportType, targetLocation, propertyDetails, platformStats } = req.body;

    const ai = getAI();

    const prompt = `You are a Principal Real Estate Research Analyst creating an Executive Real Estate Report for EEstates Agency (Developed by Krishna).
Agency Location: 568 narayan circle, bharatpur, Rajasthan, 321001.
Contact: krishnaagr047@gmail.com
Client/Admin: Krishna (krishna7073817925@gmail.com).

Report Type Requested: "${reportType || 'Comprehensive Real Estate Market & Valuation Report'}"
Target Location: "${targetLocation || 'Bharatpur, Rajasthan & Surrounding Prime Corridors'}"

${propertyDetails ? `Target Property Focus: ${JSON.stringify(propertyDetails)}` : ''}
${platformStats ? `EEstates Live Platform Metrics: ${JSON.stringify(platformStats)}` : ''}

Instructions:
1. Use real-time Google Search data to get the latest pricing trends, infrastructure projects, average price per square foot, and upcoming development corridors in the specified location.
2. Structure the report into clear, professional sections:
   - **Executive Summary**
   - **Market Dynamics & Current Price Benchmarks** (grounded in current web data)
   - **Infrastructure & Growth Catalysts**
   - **Investment Yield & Rental ROI Forecast**
   - **Risk Assessment & Due-Diligence Checklist**
   - **Strategic Recommendations from Krishna (EEstates Agency)**
3. Include specific numbers, estimated price ranges, cap rates, and timelines.
4. Conclude with a formal sign-off: "Prepared by EEstates Agency Intelligence • Developed by Krishna • 568 narayan circle, bharatpur, Rajasthan, 321001 • Contact: krishnaagr047@gmail.com".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
        tools: [{ googleSearch: {} }]
      }
    });

    const candidate = response.candidates?.[0];
    const reportMarkdown = response.text || candidate?.content?.parts?.[0]?.text || 'Report generation failed.';

    // Extract citations
    const sources: { title: string; url: string }[] = [];
    candidate?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          url: chunk.web.uri
        });
      }
    });

    return res.json({
      reportMarkdown,
      sources,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate report'
    });
  }
});

// Vite middleware for development / Static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EEstates Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
