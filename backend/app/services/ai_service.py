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
    


ai_service = AIService()