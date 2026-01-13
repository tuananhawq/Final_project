import express from 'express';
import {
  // Hero
  getHeroes,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  // Agency
  getAgencies,
  getAgencyById,
  getAllAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
  // Creator
  getCreators,
  getCreatorById,
  getAllCreators,
  createCreator,
  updateCreator,
  deleteCreator,
  // Topic
  getTopics,
  getTopicById,
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  // Testimonial
  getTestimonials,
  getTestimonialById,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  // Footer
  getFooter,
  updateFooter,
} from './home.controller.js';
import { authGuard, roleGuard } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES (GET) ====================
// Hero
router.get('/heroes', getHeroes);
// Agency
router.get('/agencies', getAgencies);
router.get('/agencies/:id', getAgencyById);
// Creator
router.get('/creators', getCreators);
router.get('/creators/:id', getCreatorById);
// Topic
router.get('/topics', getTopics);
router.get('/topics/:id', getTopicById);
// Testimonial
router.get('/testimonials', getTestimonials);
router.get('/testimonials/:id', getTestimonialById);
// Footer
router.get('/footer', getFooter);

// ==================== PROTECTED ROUTES (STAFF/ADMIN ONLY) ====================
// Hero - Admin routes
router.get('/admin/heroes', authGuard, roleGuard('staff', 'admin'), getAllHeroes);
router.post('/admin/heroes', authGuard, roleGuard('staff', 'admin'), createHero);
router.put('/admin/heroes/:id', authGuard, roleGuard('staff', 'admin'), updateHero);
router.delete('/admin/heroes/:id', authGuard, roleGuard('staff', 'admin'), deleteHero);

// Agency - Admin routes
router.get('/admin/agencies', authGuard, roleGuard('staff', 'admin'), getAllAgencies);
router.post('/admin/agencies', authGuard, roleGuard('staff', 'admin'), createAgency);
router.put('/admin/agencies/:id', authGuard, roleGuard('staff', 'admin'), updateAgency);
router.delete('/admin/agencies/:id', authGuard, roleGuard('staff', 'admin'), deleteAgency);

// Creator - Admin routes
router.get('/admin/creators', authGuard, roleGuard('staff', 'admin'), getAllCreators);
router.post('/admin/creators', authGuard, roleGuard('staff', 'admin'), createCreator);
router.put('/admin/creators/:id', authGuard, roleGuard('staff', 'admin'), updateCreator);
router.delete('/admin/creators/:id', authGuard, roleGuard('staff', 'admin'), deleteCreator);

// Topic - Admin routes
router.get('/admin/topics', authGuard, roleGuard('staff', 'admin'), getAllTopics);
router.post('/admin/topics', authGuard, roleGuard('staff', 'admin'), createTopic);
router.put('/admin/topics/:id', authGuard, roleGuard('staff', 'admin'), updateTopic);
router.delete('/admin/topics/:id', authGuard, roleGuard('staff', 'admin'), deleteTopic);

// Testimonial - Admin routes
router.get('/admin/testimonials', authGuard, roleGuard('staff', 'admin'), getAllTestimonials);
router.post('/admin/testimonials', authGuard, roleGuard('staff', 'admin'), createTestimonial);
router.put('/admin/testimonials/:id', authGuard, roleGuard('staff', 'admin'), updateTestimonial);
router.delete('/admin/testimonials/:id', authGuard, roleGuard('staff', 'admin'), deleteTestimonial);

// Footer - Admin routes
router.put('/admin/footer', authGuard, roleGuard('staff', 'admin'), updateFooter);

export default router;

