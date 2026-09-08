const activitySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['Call', 'Email', 'Visit', 'Message'], required: true },
  notes: String,
  timestamp: { type: Date, default: Date.now }
});