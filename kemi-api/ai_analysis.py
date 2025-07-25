"""
AI Analysis Module for Cryptocurrency Market Analysis
Provides intelligent market insights and analysis using Gemini AI
"""

import json
import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
import os
from datetime import datetime

# Gemini AI import
try:
    import google.generativeai as genai
except ImportError:
    genai = None
    print("Warning: google-generativeai not installed. AI analysis will use fallback mode.")

@dataclass
class CoinAnalysisData:
    """Data structure for coin analysis"""
    coin_id: str
    coin_name: str
    current_price: float
    market_cap: Optional[float]
    volume_24h: Optional[float]
    price_change_24h: float
    technical_analysis: Dict[str, Any]
    ohlc_data: List[Dict[str, Any]]
    coin_info: Dict[str, Any]

class AIAnalyzer:
    """AI-powered cryptocurrency analysis using Gemini"""
    
    def __init__(self, gemini_api_key: Optional[str] = None):
        self.gemini_api_key = gemini_api_key or os.getenv('GEMINI_API_KEY')
        
        print(f"🔧 AIAnalyzer init - API key provided: {'Yes' if gemini_api_key else 'No'}")
        print(f"🔧 AIAnalyzer init - API key from env: {'Yes' if os.getenv('GEMINI_API_KEY') else 'No'}")
        print(f"🔧 AIAnalyzer init - Final API key: {'Yes' if self.gemini_api_key else 'No'}")
        print(f"🔧 AIAnalyzer init - genai available: {'Yes' if genai else 'No'}")
        
        # Initialize Gemini
        if self.gemini_api_key and genai:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Gemini model initialized successfully!")
            except Exception as e:
                print(f"❌ Failed to initialize Gemini model: {e}")
                self.gemini_model = None
        else:
            self.gemini_model = None
            print("Warning: Gemini API key not found. AI analysis will use fallback mode.")
    
    def create_analysis_prompt(self, analysis_data: CoinAnalysisData) -> str:
        """Create a comprehensive analysis prompt for Gemini AI"""
        
        technical_summary = analysis_data.technical_analysis.get('summary', {})
        indicators = analysis_data.technical_analysis.get('indicators', {})
        signals = analysis_data.technical_analysis.get('signals', {})
        
        # Format price data for better readability
        current_price = f"${analysis_data.current_price:,.2f}"
        market_cap = f"${analysis_data.market_cap:,.0f}" if analysis_data.market_cap else 'N/A'
        volume_24h = f"${analysis_data.volume_24h:,.0f}" if analysis_data.volume_24h else 'N/A'
        
        # RSI interpretation
        rsi_value = indicators.get('rsi', 0)
        if isinstance(rsi_value, (int, float)):
            if rsi_value > 70:
                rsi_status = f"{rsi_value:.1f} (Overbought - potential sell signal)"
            elif rsi_value < 30:
                rsi_status = f"{rsi_value:.1f} (Oversold - potential buy signal)"
            else:
                rsi_status = f"{rsi_value:.1f} (Neutral zone)"
        else:
            rsi_status = "N/A"
        
        # MACD interpretation
        macd_value = indicators.get('macd', 0)
        macd_signal = indicators.get('macd_signal', 0)
        if isinstance(macd_value, (int, float)) and isinstance(macd_signal, (int, float)):
            macd_status = "Bullish momentum" if macd_value > macd_signal else "Bearish momentum"
            macd_display = f"{macd_value:.2f} ({macd_status})"
        else:
            macd_display = "N/A"
        
        prompt = f"""You are a professional cryptocurrency analyst. Analyze {analysis_data.coin_name} ({analysis_data.coin_id.upper()}) using the provided technical data and market information.

CURRENT MARKET DATA:
• Price: {current_price}
• 24h Change: {analysis_data.price_change_24h:+.2f}%
• Market Cap: {market_cap}
• 24h Volume: {volume_24h}
• Market Cap Rank: #{analysis_data.coin_info.get('market_cap_rank', 'N/A')}

TECHNICAL ANALYSIS DATA:
• Overall Trend: {signals.get('trend', 'neutral').title()} ({signals.get('strength', 'weak').title()} strength)
• Technical Recommendation: {signals.get('recommendation', 'hold').upper()}
• Analysis Confidence: {signals.get('confidence', 0):.1f}%
• Data Quality: {technical_summary.get('analysis_quality', 'unknown').title()} ({technical_summary.get('data_points', 0)} data points)

KEY TECHNICAL INDICATORS:
• RSI (14): {rsi_status}
• MACD: {macd_display}
• SMA 20: ${indicators.get('sma_20', 0):,.2f}
• SMA 50: ${indicators.get('sma_50', 0):,.2f}
• EMA 12: ${indicators.get('ema_12', 0):,.2f}
• EMA 26: ${indicators.get('ema_26', 0):,.2f}
• Volatility: {indicators.get('volatility', 0):.2f}%

SUPPORT & RESISTANCE LEVELS:
• Support: ${indicators.get('support_resistance', {}).get('support', 0):,.2f}
• Resistance: ${indicators.get('support_resistance', {}).get('resistance', 0):,.2f}

BOLLINGER BANDS:
• Upper Band: ${indicators.get('bollinger_bands', {}).get('upper', 0):,.2f}
• Middle Band: ${indicators.get('bollinger_bands', {}).get('middle', 0):,.2f}
• Lower Band: ${indicators.get('bollinger_bands', {}).get('lower', 0):,.2f}

TECHNICAL SIGNALS DETECTED:
{chr(10).join(f"• {signal}" for signal in signals.get('signals', ['No specific signals detected']))}

COIN FUNDAMENTALS:
{self._format_coin_info(analysis_data.coin_info)}

Please provide a comprehensive analysis with these sections:

## 📊 Market Overview
Analyze the current market position, recent price action, and overall market sentiment based on the data.

## 🔍 Technical Analysis Interpretation
Explain what the technical indicators suggest about price momentum, trend strength, and potential reversals. Reference specific indicator values.

## 🎯 Key Price Levels
Identify critical support and resistance levels, and explain their significance for trading decisions.

## ⚠️ Risk Assessment
Evaluate volatility, potential risks, and market uncertainties based on the technical data.

## 📈 Trading Insights
Provide short-term and medium-term outlook based on the technical analysis. Include potential entry/exit points.

## 💡 Investment Perspective
Consider fundamental factors and longer-term implications for investors.

Use specific numbers from the data provided. Be analytical and educational, avoiding direct financial advice. Format with clear headings and bullet points."""
        
        return prompt
    
    def _format_coin_info(self, coin_info: Dict[str, Any]) -> str:
        """Format coin information for the prompt"""
        if not coin_info:
            return "- No additional coin information available"
        
        info_parts = []
        
        if coin_info.get('description'):
            desc = coin_info['description'][:200] + "..." if len(coin_info.get('description', '')) > 200 else coin_info.get('description', '')
            info_parts.append(f"- Description: {desc}")
        
        if coin_info.get('market_cap_rank'):
            info_parts.append(f"- Market Cap Rank: #{coin_info['market_cap_rank']}")
        
        if coin_info.get('total_supply'):
            info_parts.append(f"- Total Supply: {coin_info['total_supply']:,.0f}")
        
        if coin_info.get('circulating_supply'):
            info_parts.append(f"- Circulating Supply: {coin_info['circulating_supply']:,.0f}")
        
        if coin_info.get('categories'):
            categories = coin_info['categories'][:3]  # First 3 categories
            info_parts.append(f"- Categories: {', '.join(categories)}")
        
        return '\n'.join(info_parts) if info_parts else "- No additional coin information available"
    
    async def generate_gemini_analysis(self, analysis_data: CoinAnalysisData) -> Optional[str]:
        """Generate analysis using Gemini AI"""
        if not self.gemini_model:
            return None
        
        try:
            prompt = self.create_analysis_prompt(analysis_data)
            response = await asyncio.to_thread(self.gemini_model.generate_content, prompt)
            return response.text
        except Exception as e:
            print(f"Gemini analysis error: {e}")
            return None
    
    async def generate_comprehensive_analysis(self, analysis_data: CoinAnalysisData) -> Dict[str, Any]:
        """Generate comprehensive AI analysis using Gemini"""
        
        # Try Gemini first
        analysis_text = await self.generate_gemini_analysis(analysis_data)
        provider_used = "gemini" if analysis_text else None
        
        # Fallback analysis if Gemini fails
        if not analysis_text:
            print("Gemini analysis failed, using enhanced fallback analysis")
            analysis_text = self._generate_enhanced_fallback_analysis(analysis_data)
            provider_used = "enhanced_fallback"
        
        return {
            "analysis": analysis_text,
            "provider": provider_used,
            "timestamp": datetime.utcnow().isoformat(),
            "coin_id": analysis_data.coin_id,
            "coin_name": analysis_data.coin_name,
            "technical_summary": analysis_data.technical_analysis.get('summary', {}),
            "recommendation": analysis_data.technical_analysis.get('signals', {}).get('recommendation', 'hold'),
            "confidence": analysis_data.technical_analysis.get('signals', {}).get('confidence', 0)
        }
    
    def _generate_enhanced_fallback_analysis(self, analysis_data: CoinAnalysisData) -> str:
        """Generate enhanced fallback analysis when Gemini is unavailable"""
        
        technical_summary = analysis_data.technical_analysis.get('summary', {})
        indicators = analysis_data.technical_analysis.get('indicators', {})
        signals = analysis_data.technical_analysis.get('signals', {})
        
        analysis = f"""
# Technical Analysis for {analysis_data.coin_name} ({analysis_data.coin_id.upper()})

## Market Overview
- **Current Price**: ${analysis_data.current_price:,.6f}
- **24h Change**: {analysis_data.price_change_24h:+.2f}%
- **Market Cap**: ${analysis_data.market_cap:,.0f} if analysis_data.market_cap else 'N/A'
- **24h Volume**: ${analysis_data.volume_24h:,.0f} if analysis_data.volume_24h else 'N/A'

## Technical Analysis Summary
- **Trend**: {signals.get('trend', 'neutral').title()}
- **Strength**: {signals.get('strength', 'weak').title()}
- **Recommendation**: {signals.get('recommendation', 'hold').upper()}
- **Confidence**: {signals.get('confidence', 0):.1f}%

## Key Technical Indicators
- **RSI (14)**: {indicators.get('rsi', 'N/A')} - {'Overbought territory' if isinstance(indicators.get('rsi'), (int, float)) and indicators.get('rsi', 0) > 70 else 'Oversold territory' if isinstance(indicators.get('rsi'), (int, float)) and indicators.get('rsi', 0) < 30 else 'Neutral zone' if isinstance(indicators.get('rsi'), (int, float)) else 'Data unavailable'}
- **Moving Averages**: SMA20: ${indicators.get('sma_20', 'N/A')}, SMA50: ${indicators.get('sma_50', 'N/A')}
- **MACD**: {indicators.get('macd', 'N/A')} - {'Bullish momentum' if isinstance(indicators.get('macd'), (int, float)) and indicators.get('macd', 0) > 0 else 'Bearish momentum' if isinstance(indicators.get('macd'), (int, float)) and indicators.get('macd', 0) < 0 else 'Neutral'}

## Support & Resistance Levels
- **Support**: ${indicators.get('support_resistance', {}).get('support', 'N/A')}
- **Resistance**: ${indicators.get('support_resistance', {}).get('resistance', 'N/A')}

## Risk Assessment
- **Volatility**: {indicators.get('volatility', 'N/A')}% - {'High volatility' if isinstance(indicators.get('volatility'), (int, float)) and indicators.get('volatility', 0) > 5 else 'Moderate volatility' if isinstance(indicators.get('volatility'), (int, float)) and indicators.get('volatility', 0) > 2 else 'Low volatility' if isinstance(indicators.get('volatility'), (int, float)) else 'Volatility data unavailable'}
- **Analysis Quality**: {technical_summary.get('analysis_quality', 'unknown').title()}

## Technical Signals
{chr(10).join(f"• {signal}" for signal in signals.get('signals', ['No signals available']))}

---
*This analysis is based on technical indicators and should not be considered as financial advice. Always do your own research before making investment decisions.*
"""
        return analysis.strip()

# Utility functions for data processing
def prepare_analysis_data(coin_data: Dict[str, Any], technical_analysis: Dict[str, Any], ohlc_data: List[Dict[str, Any]]) -> CoinAnalysisData:
    """Prepare data for AI analysis"""
    return CoinAnalysisData(
        coin_id=coin_data.get('id', ''),
        coin_name=coin_data.get('name', ''),
        current_price=coin_data.get('market_data', {}).get('current_price', {}).get('usd', 0),
        market_cap=coin_data.get('market_data', {}).get('market_cap', {}).get('usd'),
        volume_24h=coin_data.get('market_data', {}).get('total_volume', {}).get('usd'),
        price_change_24h=coin_data.get('market_data', {}).get('price_change_percentage_24h', 0),
        technical_analysis=technical_analysis,
        ohlc_data=ohlc_data,
        coin_info={
            'description': coin_data.get('description', {}).get('en', ''),
            'market_cap_rank': coin_data.get('market_cap_rank'),
            'total_supply': coin_data.get('market_data', {}).get('total_supply'),
            'circulating_supply': coin_data.get('market_data', {}).get('circulating_supply'),
            'categories': coin_data.get('categories', [])
        }
    )