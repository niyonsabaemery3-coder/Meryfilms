import mongoose from 'mongoose'

const narratorSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

narratorSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret.slug
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Narrator = mongoose.model('Narrator', narratorSchema)
