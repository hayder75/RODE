const mongoose = require('mongoose');

const entryCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
});

const EntryCode = mongoose.model('EntryCode', entryCodeSchema);
module.exports = EntryCode;
