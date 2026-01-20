
import Trader from '../models/Trader.js';

export const getTraders = async (req, res) => {
  try {
    const { location, search } = req.query;
    let filter = {};

    if (location) filter.location = location;

    let traders = await Trader.find(filter).sort({ rating: -1 });

    if (search) {
      traders = traders.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.dealsIn.some(crop => crop.toLowerCase().includes(search.toLowerCase()))
      );
    }

    res.json(traders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching traders' });
  }
};

export const addTrader = async (req, res) => {
  try {
    const data = req.body;
    const trader = await Trader.create({
      ...data,
      rating: 0,
      reviewCount: 0
    });
    res.json({ id: trader._id, message: 'Trader added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding trader' });
  }
};
