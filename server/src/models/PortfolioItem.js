import mongoose from 'mongoose';

const PORTFOLIO_TYPES = ['reel', 'video', 'photoshop', 'illustrator'];

const portfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 1200
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: PORTFOLIO_TYPES
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: 80
    },
    tools: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 12 && value.every((tool) => tool.trim().length <= 40);
        },
        message: 'Tools must be a short list of labels'
      }
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: ''
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

portfolioItemSchema.index({ type: 1, featured: 1, createdAt: -1 });
portfolioItemSchema.index({ title: 'text', description: 'text', category: 'text' });

export { PORTFOLIO_TYPES };
export default mongoose.model('PortfolioItem', portfolioItemSchema);
