/**
 * @boostengine/currency - AI Agent Tool Definitions
 */

import { CurrencyEngine } from './engine';
import { RoundingStrategy } from './types';

export interface AgentCurrencyToolsOptions {
  engine: CurrencyEngine;
}

export function createCurrencyAgentTools(options: AgentCurrencyToolsOptions) {
  const { engine } = options;

  return [
    {
      name: 'convert_currency_price',
      description: 'Convert a price between two global currencies with optional psychological rounding (e.g. .99 charm pricing).',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Source price amount' },
          fromCurrency: { type: 'string', description: 'Source currency ISO code (e.g. INR, USD)' },
          toCurrency: { type: 'string', description: 'Target currency ISO code (e.g. USD, EUR, AED)' },
          rounding: {
            type: 'string',
            enum: ['none', 'round_up_99', 'round_up_95', 'round_up_49', 'round_integer', 'round_nearest_99'],
            description: 'Optional psychological rounding strategy'
          }
        },
        required: ['amount', 'fromCurrency', 'toCurrency']
      },
      handler: async (args: {
        amount: number;
        fromCurrency: string;
        toCurrency: string;
        rounding?: RoundingStrategy;
      }) => {
        try {
          const result = engine.convert(args.amount, args.fromCurrency, args.toCurrency, {
            rounding: args.rounding
          });
          return {
            success: true,
            conversion: result
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'format_currency_price',
      description: 'Format a number into a localized currency string with appropriate symbol and thousands separators.',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'The numeric price amount' },
          currencyCode: { type: 'string', description: 'Currency ISO code (e.g. USD, INR, GBP, EUR)' },
          showCode: { type: 'boolean', description: 'Whether to append the 3-letter currency code' }
        },
        required: ['amount', 'currencyCode']
      },
      handler: async (args: { amount: number; currencyCode: string; showCode?: boolean }) => {
        try {
          const formatted = engine.formatPrice(args.amount, args.currencyCode, {
            showCode: args.showCode
          });
          const meta = engine.getCurrencyMetadata(args.currencyCode);
          return {
            success: true,
            formatted,
            symbol: meta.symbol,
            currencyCode: meta.code
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'detect_currency_from_country',
      description: 'Find the standard local currency and symbol for a given 2-letter ISO country code (e.g. US -> USD, AE -> AED, IN -> INR).',
      parameters: {
        type: 'object',
        properties: {
          countryCode: { type: 'string', description: '2-letter ISO country code (e.g. US, IN, GB, AE, SG)' }
        },
        required: ['countryCode']
      },
      handler: async (args: { countryCode: string }) => {
        const currencyCode = engine.detectCurrencyFromCountry(args.countryCode);
        const meta = engine.getCurrencyMetadata(currencyCode);
        return {
          success: true,
          countryCode: args.countryCode.toUpperCase(),
          currencyCode,
          symbol: meta.symbol,
          currencyName: meta.name
        };
      }
    },
    {
      name: 'get_live_exchange_rates',
      description: 'Get all active exchange rates configured in the engine.',
      parameters: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        return {
          success: true,
          rates: engine.exportRates()
        };
      }
    }
  ];
}
