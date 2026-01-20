
import { generateText } from '../services/geminiService.js';

let cache = { data: null, expiry: 0 };

const MOCK_PRICES = [
  { crop: 'Wheat', market: 'Nagpur APMC', state: 'Maharashtra', minPrice: 2150, maxPrice: 2450, modalPrice: 2300, lastUpdated: new Date().toISOString() },
  { crop: 'Rice', market: 'Burdwan', state: 'West Bengal', minPrice: 2800, maxPrice: 3200, modalPrice: 3000, lastUpdated: new Date().toISOString() },
  { crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', minPrice: 1400, maxPrice: 1800, modalPrice: 1600, lastUpdated: new Date().toISOString() },
];

export const getPrices = async (req, res) => {
  const { crop, state } = req.query;

  if (cache.data && Date.now() < cache.expiry) {
    return res.json(filterResults(cache.data, crop, state));
  }

  cache.data = MOCK_PRICES;
  cache.expiry = Date.now() + 10 * 60 * 1000;
  res.json(filterResults(cache.data, crop, state));
};

export const getMarketRecommendations = async (req, res) => {
  try {
    const { location, soilType, farmSize, currentCrop, irrigation, language } = req.body;
    
    const systemInstruction = `You are a Smart Farming Market Strategist. 
      Analyze the farm profile and suggest the best crops for profit, 
      best selling months, and water management tips. 
      Reply strictly in ${language || 'English'}. Use markdown.`;

    const prompt = `Location: ${location}, Soil: ${soilType}, Size: ${farmSize} Acres, Current Crop: ${currentCrop}, Irrigation: ${irrigation}.`;
    
    const response = await generateText(prompt, systemInstruction);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

function filterResults(data, crop, state) {
  return data.filter(p => {
    const matchCrop = crop ? p.crop.toLowerCase().includes(crop.toLowerCase()) : true;
    const matchState = state ? p.state.toLowerCase().includes(state.toLowerCase()) : true;
    return matchCrop && matchState;
  });
}
