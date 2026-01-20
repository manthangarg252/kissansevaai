
import IoTData from '../models/IoTData.js';

export const getLiveStats = async (req, res) => {
  try {
    const latest = await IoTData.findOne().sort({ createdAt: -1 });
    if (!latest) {
      return res.json({
        temperature: 28.5,
        humidity: 65,
        soilMoisture: 42,
        phLevel: 6.8,
        timestamp: new Date().toISOString()
      });
    }
    res.json({
        temperature: latest.temperature,
        humidity: latest.humidity,
        soilMoisture: latest.soilMoisture,
        phLevel: latest.phLevel,
        timestamp: latest.timestamp
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching IoT data' });
  }
};

export const updateStats = async (req, res) => {
  try {
    const data = req.body;
    await IoTData.create({
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soilMoisture,
      phLevel: data.phLevel
    });
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating IoT data' });
  }
};
