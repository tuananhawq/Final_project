import Hero from "../../models/Hero.js";
import Agency from "../../models/Agency.js";
import Creator from "../../models/Creator.js";
import Topic from "../../models/Topic.js";
import Testimonial from "../../models/Testimonial.js";
import Footer from "../../models/Footer.js";

// ==================== HERO ====================
export const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createHero = async (req, res) => {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hero) return res.status(404).json({ error: "Hero not found" });
    res.json(hero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ error: "Hero not found" });
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== AGENCY ====================
export const getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({ isActive: true }).sort({ order: 1 }).limit(3);
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      return res.status(404).json({ error: "Agency not found" });
    }
    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().sort({ order: 1 });
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAgency = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);
    res.status(201).json(agency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agency) return res.status(404).json({ error: "Agency not found" });
    res.json(agency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);
    if (!agency) return res.status(404).json({ error: "Agency not found" });
    res.json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== CREATOR ====================
export const getCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ isActive: true }).sort({ order: 1 }).limit(6);
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCreatorById = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCreators = async (req, res) => {
  try {
    const creators = await Creator.find().sort({ order: 1 });
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCreator = async (req, res) => {
  try {
    const creator = await Creator.create(req.body);
    res.status(201).json(creator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCreator = async (req, res) => {
  try {
    const creator = await Creator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!creator) return res.status(404).json({ error: "Creator not found" });
    res.json(creator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCreator = async (req, res) => {
  try {
    const creator = await Creator.findByIdAndDelete(req.params.id);
    if (!creator) return res.status(404).json({ error: "Creator not found" });
    res.json({ message: "Creator deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== TOPIC ====================
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ isActive: true }).sort({ order: 1 }).limit(3);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== TESTIMONIAL ====================
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 }).limit(3);
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== FOOTER ====================
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({});
    }
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create(req.body);
    } else {
      footer = await Footer.findByIdAndUpdate(footer._id, req.body, { new: true });
    }
    res.json(footer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

