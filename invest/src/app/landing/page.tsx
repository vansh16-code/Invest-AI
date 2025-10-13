'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { TrendingUp, Bot, Trophy, ArrowRight, Play } from 'lucide-react'
import LightRays from '@/components/LightRays'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  useEffect(() => {
    // Hero animations
    gsap.from(".hero-left", { x: -100, opacity: 0, duration: 1 })
    gsap.from(".hero-right", { x: 100, opacity: 0, duration: 1, delay: 0.3 })

    // Feature cards animation
    gsap.utils.toArray(".feature-card").forEach((el: any) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 85%" }
      })
    })

    // Steps animation
    gsap.utils.toArray(".step-card").forEach((el: any, index: number) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: { trigger: el, start: "top 85%" }
      })
    })



    // CTA animation
    gsap.from(".cta-content", {
      scale: 0.9,
      opacity: 0,
      duration: 1,
      scrollTrigger: { trigger: ".cta-content", start: "top 85%" }
    })

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Light Rays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#8b5cf6"
          raysSpeed={0.8}
          lightSpread={1.5}
          rayLength={2}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.8}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.05}
          distortion={0.2}
          className="opacity-30"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">


      {/* Hero Section */}
      <section id="home" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hero-left">
              <h1 className="text-5xl font-bold text-white mb-6">
                Learn to Invest — Without Losing a Rupee.
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Simulate stock trading, understand the market, and grow your financial IQ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center shadow-lg shadow-purple-500/25">
                  Start Simulating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/learn" className="border border-slate-600 text-slate-300 px-8 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="hero-right">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
                  <span className="text-green-400 text-sm font-medium">+12.5%</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Value</span>
                    <span className="font-semibold text-white">₹1,12,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Today's P&L</span>
                    <span className="font-semibold text-green-400">+₹2,340</span>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-end justify-center pb-4">
                    <div className="text-white text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-sm">Growing Portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="learn" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Build Investing Confidence</h2>
            <p className="text-xl text-slate-300">Master the markets with our comprehensive learning platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-purple-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Virtual Trading</h3>
              <p className="text-slate-300">Learn real market behavior with fake cash. Practice without risk and build confidence.</p>
            </div>
            
            <div className="feature-card bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-purple-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Mentor</h3>
              <p className="text-slate-300">Understand finance terms with simple explanations. Get instant help when you need it.</p>
            </div>
            
            <div className="feature-card bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-purple-600/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Trophy className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              <p className="text-slate-300">Compete with others to improve. Track your progress and climb the rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="simulate" className="bg-slate-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300">Start your investing journey in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-purple-500/30 border-dashed border-t-2"></div>
            
            <div className="step-card text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10 shadow-lg shadow-purple-500/25">
                1
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Sign Up</h3>
                <p className="text-slate-300">Get ₹1,00,000 virtual cash to start your trading journey. No real money at risk.</p>
              </div>
            </div>
            
            <div className="step-card text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10 shadow-lg shadow-purple-500/25">
                2
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Trade Real Stocks</h3>
                <p className="text-slate-300">Buy and sell actual stocks with real market prices. Experience authentic trading.</p>
              </div>
            </div>
            
            <div className="step-card text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10 shadow-lg shadow-purple-500/25">
                3
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Track & Learn</h3>
                <p className="text-slate-300">Monitor your progress, analyze performance, and improve your investing skills.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="cta-content">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Investing Journey Today — Free & Fun.
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of learners who are building their financial future with confidence.
            </p>
            <Link href="/register" className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors hover:scale-105 transform shadow-lg shadow-purple-500/25">
              Get Started Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl text-white mb-4">InvestLearn</div>
              <p className="text-slate-400 text-sm">
                Learn to invest without losing money. Build confidence through simulation and education.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/learn" className="block text-slate-400 hover:text-purple-400 transition-colors">Learn</Link>
                <Link href="/login" className="block text-slate-400 hover:text-purple-400 transition-colors">Login</Link>
                <Link href="/register" className="block text-slate-400 hover:text-purple-400 transition-colors">Sign Up</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-slate-400 hover:text-purple-400 transition-colors">Virtual Trading</Link>
                <Link href="/ai-explain" className="block text-slate-400 hover:text-purple-400 transition-colors">AI Mentor</Link>
                <Link href="/leaderboard" className="block text-slate-400 hover:text-purple-400 transition-colors">Leaderboard</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-700 rounded hover:bg-purple-600 transition-colors cursor-pointer"></div>
                <div className="w-8 h-8 bg-slate-700 rounded hover:bg-purple-600 transition-colors cursor-pointer"></div>
                <div className="w-8 h-8 bg-slate-700 rounded hover:bg-purple-600 transition-colors cursor-pointer"></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 InvestLearn. All rights reserved. Made with ❤️ for financial education.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}