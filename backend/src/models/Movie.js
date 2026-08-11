import mongoose from 'mongoose'

const { Schema } = mongoose

// Comments can nest one level (replies) — matches frontend's MovieComment type.
const commentSchema = new Schema(
  {
    author: { type: String, required: true, trim: true, maxlength: 80 },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Number, default: () => Date.now() },
    replies: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: true }
)

const movieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true }, // Category.slug
    synopsis: { type: String, required: true, trim: true },
    poster: { type: String, required: true },
    backdrop: { type: String, required: true },

    uploadedAt: { type: Number, default: () => Date.now(), index: true },
    uploadedBy: { type: String, trim: true },

    views: { type: Number, default: 0, index: true },
    likes: { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [] },

    trending: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },

    episodeCurrent: { type: Number },
    episodeTotal: { type: Number },
    videoFileName: { type: String },
    episodeFileNames: { type: [String], default: undefined },

    seasonNumber: { type: Number },
    status: { type: String, enum: ['ongoing', 'finished'] },
    parts: { type: [String], default: undefined },
  },
  { timestamps: true }
)

// Full-text search across title + synopsis, used by the site search box.
movieSchema.index({ title: 'text', synopsis: 'text' })
// Common admin/home-page query shapes.
movieSchema.index({ category: 1, uploadedAt: -1 })
movieSchema.index({ trending: 1, uploadedAt: -1 })
movieSchema.index({ featured: 1, uploadedAt: -1 })

movieSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Movie = mongoose.model('Movie', movieSchema)
