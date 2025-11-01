export type Language = 'id' | 'en';
export type MarketType = 'forex' | 'crypto' | 'commodity';
export type TradingStyle = 'scalping' | 'intraday' | 'swing' | 'position';
export type ChartTimeframe = 'MN' | 'W1' | 'D1' | '4H' | '1H' | '15M' | '5M';

export type AnalysisHierarchy = {
  trend: ChartTimeframe;
  structure: ChartTimeframe;
  entry: ChartTimeframe;
};

export type ChartImages = {
  [key in ChartTimeframe]?: { base64: string; name: string };
};

export interface Analysis {
  pair: string;
  direction: "LONG" | "SHORT" | "WAIT";
  entry: number;
  stop_loss: number;
  take_profit: number;
  risk_reward: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  analysis: {
    "4H": string; // Note: These keys remain fixed for schema consistency, AI will map dynamic TFs here.
    "1H": string;
    "15M": string;
    volume: string;
    divergence: string;
  };
  scenario: {
    tp: string;
    sl: string;
  };
  report: string; // This will hold the markdown text
}


export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}