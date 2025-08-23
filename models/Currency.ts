import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICurrencyRate extends Document {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExchangeRateHistory extends Document {
  currencyCode: string;
  date: Date;
  rate: number;
  source: string;
  createdAt: Date;
}

const CurrencyRateSchema: Schema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true,
    minlength: 3,
    maxlength: 3
  },
  name: { 
    type: String, 
    required: true 
  },
  symbol: { 
    type: String, 
    required: true 
  },
  rate: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  isBaseCurrency: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Ensure only one base currency exists
CurrencyRateSchema.pre('save', async function(next) {
  if (this.isBaseCurrency) {
    try {
      // Get the model using mongoose.model
      const CurrencyModel = mongoose.models.CurrencyRate as Model<ICurrencyRate>;
      
      // If this is set as base currency, unset any other base currencies
      await CurrencyModel.updateMany(
        { _id: { $ne: this._id }, isBaseCurrency: true },
        { $set: { isBaseCurrency: false } }
      );
      
      // Set rate to 1 for base currency
      this.rate = 1;
    } catch (error) {
      console.error('Error in pre-save hook:', error);
    }
  }
  next();
});

const ExchangeRateHistorySchema: Schema = new Schema({
  currencyCode: { 
    type: String, 
    required: true, 
    uppercase: true, 
    trim: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  rate: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  source: { 
    type: String, 
    default: 'Manual' 
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
CurrencyRateSchema.index({ code: 1 }, { unique: true });
CurrencyRateSchema.index({ isBaseCurrency: 1 });
CurrencyRateSchema.index({ isActive: 1 });

ExchangeRateHistorySchema.index({ currencyCode: 1, date: -1 });

// Check if models are already defined to prevent overwriting during hot reloads
export const CurrencyRate = mongoose.models.CurrencyRate || 
  mongoose.model<ICurrencyRate>('CurrencyRate', CurrencyRateSchema);

export const ExchangeRateHistory = mongoose.models.ExchangeRateHistory || 
  mongoose.model<IExchangeRateHistory>('ExchangeRateHistory', ExchangeRateHistorySchema);
