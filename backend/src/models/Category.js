import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    // Matches the frontend's Category.id (e.g. "horror") — a stable slug,
    // not the Mongo _id, so the UI's existing string ids keep working.
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret.slug
    delete ret._id
    delete ret.__v
    return ret
  },
})
categorySchema.set('toObject', { virtuals: true })

export const Category = mongoose.model('Category', categorySchema)
