'use client'

import { useState } from 'react'
import { HelpCircle, X, Loader2 } from 'lucide-react'
import { aiAPI, handleApiError } from '@/lib/api'

interface AIExplainBoxProps {
    term: string
    children: React.ReactNode
}

export default function AIExplainBox({ term, children }: AIExplainBoxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [explanation, setExplanation] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleExplain = async () => {
        if (!isOpen) {
            setIsOpen(true)
            if (!explanation) {
                setIsLoading(true)
                try {
                    const result = await aiAPI.explainTerm(term)
                    setExplanation(result.explanation)
                } catch (error) {
                    console.error('Failed to get AI explanation:', error)
                    const { error: errorMessage } = handleApiError(error)
                    setExplanation(`Sorry, I couldn't explain this term right now. ${errorMessage}`)
                } finally {
                    setIsLoading(false)
                }
            }
        } else {
            setIsOpen(false)
        }
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={handleExplain}
                className="inline-flex items-center space-x-1 text-white hover:text-purple-400 transition-colors"
            >
                {children}
                <HelpCircle className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-80 p-4 mt-2 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{term}</h4>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-slate-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-slate-300">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is explaining...</span>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400">💡 Powered by AI</p>
                    </div>
                </div>
            )}
        </div>
    )
}