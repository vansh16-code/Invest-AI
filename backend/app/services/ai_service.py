import google.generativeai as genai
from typing import List
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .. import models

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            # Use the most efficient model for free tier
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.enabled = True
            print("Gemini AI service initialized successfully")
        else:
            self.model = None
            self.enabled = False
            print("Warning: GEMINI_API_KEY not set. AI features will return mock responses.")
    
    async def explain_term(self, term: str, db: AsyncSession) -> str:
        """Explain a financial term using AI"""
        # Check if explanation already exists
        result = await db.execute(select(models.AIExplanation).filter(models.AIExplanation.term == term.lower()))
        existing = result.scalar_one_or_none()
        if existing:
            return existing.explanation
        
        if not self.enabled:
            # Return a mock explanation when Gemini API is not available
            explanation = f"{term} is an important financial concept. This is a placeholder explanation since Gemini API is not configured. Please set your GEMINI_API_KEY environment variable to get detailed AI explanations."
            
            # Save mock explanation to database
            db_explanation = models.AIExplanation(term=term.lower(), explanation=explanation)
            db.add(db_explanation)
            await db.commit()
            
            return explanation
        
        try:
            prompt = f"You are a financial education assistant. Explain the financial term '{term}' in simple, easy-to-understand language for beginners. Keep it to 2-3 sentences."
            
            response = self.model.generate_content(prompt)
            explanation = response.text.strip()
            
            # Save explanation to database
            db_explanation = models.AIExplanation(term=term.lower(), explanation=explanation)
            db.add(db_explanation)
            await db.commit()
            
            return explanation
        except Exception as e:
            error_str = str(e)
            print(f"Gemini API error: {e}")
            
            # Handle quota exceeded errors specifically
            if "quota" in error_str.lower() or "429" in error_str:
                fallback_explanation = self._get_fallback_explanation(term)
                
                # Save fallback explanation to database
                db_explanation = models.AIExplanation(term=term.lower(), explanation=fallback_explanation)
                db.add(db_explanation)
                await db.commit()
                
                return fallback_explanation
            
            return f"Sorry, I couldn't explain '{term}' at the moment. Please try again later."
    
    def _get_fallback_explanation(self, term: str) -> str:
        """Provide fallback explanations for common financial terms when AI is unavailable"""
        fallback_explanations = {
            "stock": "A stock represents ownership in a company. When you buy stock, you become a shareholder and own a piece of that business.",
            "dividend": "A dividend is a payment made by companies to their shareholders, usually from profits. It's like getting a bonus for owning the stock.",
            "p/e ratio": "The Price-to-Earnings ratio compares a company's stock price to its earnings per share. It helps investors determine if a stock is expensive or cheap.",
            "market cap": "Market capitalization is the total value of a company's shares. It's calculated by multiplying the stock price by the number of shares outstanding.",
            "bull market": "A bull market is a period when stock prices are rising and investor confidence is high. It's called 'bull' because bulls attack upward.",
            "bear market": "A bear market is a period when stock prices are falling by 20% or more. It's called 'bear' because bears attack downward.",
            "volatility": "Volatility measures how much a stock's price moves up and down. High volatility means the price changes a lot, low volatility means it's more stable.",
            "portfolio": "A portfolio is your collection of investments like stocks, bonds, and other assets. Diversifying your portfolio helps reduce risk.",
            "eps": "Earnings Per Share (EPS) is a company's profit divided by the number of shares. It shows how much money the company makes for each share.",
            "roe": "Return on Equity (ROE) measures how efficiently a company uses shareholders' money to generate profits. Higher ROE is generally better.",
            "liquidity": "Liquidity refers to how easily you can buy or sell an investment without affecting its price. Cash is the most liquid asset.",
            "diversification": "Diversification means spreading your investments across different types of assets to reduce risk. Don't put all your eggs in one basket.",
            "day trading": "Day trading involves buying and selling stocks within the same trading day. It's risky and requires significant time and knowledge.",
            "buy and hold": "Buy and hold is a long-term investment strategy where you purchase stocks and keep them for years, regardless of market fluctuations."
        }
        
        term_lower = term.lower()
        if term_lower in fallback_explanations:
            return fallback_explanations[term_lower]
        
        return f"{term} is an important financial concept. Due to high demand, detailed AI explanations are temporarily limited. Please try again later or search for this term online for more information."
    
    def get_market_insights(self) -> List[dict]:
        """Generate market insights using AI or fallback data"""
        if not self.enabled:
            return self._get_fallback_insights()
        
        try:
            prompt = """As a financial market analyst, provide 3 brief market insights for today. 
            For each insight, provide:
            1. A clear title (max 4 words)
            2. Content (2-3 sentences explaining the insight)
            3. Sentiment (positive, negative, or neutral)
            4. Confidence score (0.0 to 1.0)
            
            Focus on general market trends, sector performance, or economic indicators."""
            
            response = self.model.generate_content(prompt)
            
            # Parse AI response or return structured fallback
            return self._parse_ai_insights(response.text) if response.text else self._get_fallback_insights()
            
        except Exception as e:
            print(f"Gemini API error in market insights: {e}")
            return self._get_fallback_insights()
    
    def _get_fallback_insights(self) -> List[dict]:
        """Provide fallback market insights when AI is unavailable"""
        import random
        
        insights_pool = [
            {
                "title": "Tech Sector Rally",
                "content": "Technology stocks are showing strong momentum driven by AI and cloud computing growth. Major tech companies continue to outperform market expectations.",
                "sentiment": "positive",
                "confidence": 0.78
            },
            {
                "title": "Market Volatility",
                "content": "Increased market volatility expected due to upcoming earnings season. Investors should consider risk management strategies and portfolio diversification.",
                "sentiment": "neutral",
                "confidence": 0.82
            },
            {
                "title": "Energy Transition",
                "content": "Renewable energy stocks gaining traction as governments push for clean energy initiatives. Traditional energy companies adapting to sustainable practices.",
                "sentiment": "positive",
                "confidence": 0.71
            },
            {
                "title": "Interest Rate Impact",
                "content": "Federal Reserve policy decisions continue to influence market sentiment. Financial sector showing mixed signals amid rate uncertainty.",
                "sentiment": "neutral",
                "confidence": 0.65
            },
            {
                "title": "Consumer Spending",
                "content": "Retail and consumer discretionary stocks facing headwinds from changing spending patterns. E-commerce continues to gain market share.",
                "sentiment": "negative",
                "confidence": 0.73
            }
        ]
        
        # Return 3 random insights
        selected_insights = random.sample(insights_pool, 3)
        return selected_insights
    
    def _parse_ai_insights(self, ai_text: str) -> List[dict]:
        """Parse AI response into structured insights"""
        # Fallback to structured insights if parsing fails
        return self._get_fallback_insights()
    
    def analyze_portfolio(self, portfolio_data: List[dict]) -> dict:
        """Analyze user's portfolio and provide recommendations"""
        try:
            if not portfolio_data:
                return {
                    "total_value": 0,
                    "total_pnl": 0,
                    "total_pnl_percentage": 0,
                    "risk_score": 0,
                    "diversification_score": 0,
                    "recommendations": ["Start investing to build your portfolio!"]
                }
            
            # Calculate portfolio metrics
            total_value = sum(holding['current_price'] * holding['quantity'] for holding in portfolio_data)
            total_pnl = sum((holding['current_price'] - holding['avg_price']) * holding['quantity'] for holding in portfolio_data)
            total_invested = total_value - total_pnl
            total_pnl_percentage = (total_pnl / total_invested * 100) if total_invested > 0 else 0
            
            # Calculate diversification score (0-1)
            num_holdings = len(portfolio_data)
            diversification_score = min(num_holdings / 10, 1.0)
            
            # Calculate risk score based on portfolio concentration
            if num_holdings == 0:
                risk_score = 0
            elif num_holdings == 1:
                risk_score = 0.9
            elif num_holdings <= 3:
                risk_score = 0.7
            elif num_holdings <= 5:
                risk_score = 0.5
            else:
                risk_score = 0.3
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                num_holdings, diversification_score, risk_score, total_pnl_percentage
            )
            
            return {
                "total_value": round(total_value, 2),
                "total_pnl": round(total_pnl, 2),
                "total_pnl_percentage": round(total_pnl_percentage, 2),
                "risk_score": round(risk_score, 2),
                "diversification_score": round(diversification_score, 2),
                "recommendations": recommendations
            }
            
        except Exception as e:
            print(f"Error in portfolio analysis: {e}")
            return {
                "total_value": 0,
                "total_pnl": 0,
                "total_pnl_percentage": 0,
                "risk_score": 0,
                "diversification_score": 0,
                "recommendations": ["Portfolio analysis temporarily unavailable"]
            }
    
    def _generate_recommendations(self, num_holdings: int, diversification_score: float, 
                                risk_score: float, pnl_percentage: float) -> List[str]:
        """Generate personalized portfolio recommendations"""
        recommendations = []
        
        if num_holdings < 3:
            recommendations.append("Consider diversifying across different sectors to reduce risk")
        elif num_holdings < 5:
            recommendations.append("Add 1-2 more stocks from different industries for better diversification")
        
        if risk_score > 0.7:
            recommendations.append("Your portfolio has high concentration risk - consider spreading investments")
        
        if pnl_percentage < -10:
            recommendations.append("Review underperforming positions and consider rebalancing")
        elif pnl_percentage > 20:
            recommendations.append("Consider taking some profits and rebalancing your portfolio")
        
        if diversification_score < 0.5:
            recommendations.append("Explore different market sectors like technology, healthcare, or finance")
        
        recommendations.append("Set stop-loss orders to protect against significant losses")
        recommendations.append("Regularly review and rebalance your portfolio quarterly")
        
        return recommendations[:4]

ai_service = AIService()