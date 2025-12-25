'use client'

import { useState } from 'react'

export default function SmileyRating({ 
    rating, 
    onRatingChange, 
    size = 32,
    ratingLabels = {  
        veryPoor: 'Very Poor',
        poor: 'Poor',
        belowAverage: 'Below Average',
        fair: 'Fair',
        average: 'Average',
        good: 'Good',
        veryGood: 'Very Good',
        great: 'Great',
        excellent: 'Excellent',
        outstanding: 'Outstanding',
    }
}) {
    const [hoverRating, setHoverRating] = useState(0)

    // ✅ Updated with translation keys
    const smileyFaces = [
        { value: 1, emoji: '😢', labelKey: 'veryPoor', color: 'text-red-500' },
        { value: 2, emoji: '😞', labelKey: 'poor', color: 'text-red-400' },
        { value: 3, emoji: '😕', labelKey: 'belowAverage', color: 'text-orange-500' },
        { value: 4, emoji: '😐', labelKey: 'fair', color: 'text-orange-400' },
        { value: 5, emoji: '🙂', labelKey: 'average', color: 'text-yellow-500' },
        { value: 6, emoji: '😊', labelKey: 'good', color: 'text-yellow-400' },
        { value: 7, emoji: '😄', labelKey: 'veryGood', color: 'text-lime-500' },
        { value: 8, emoji: '😁', labelKey: 'great', color: 'text-green-400' },
        { value: 9, emoji: '🤩', labelKey: 'excellent', color: 'text-green-500' },
        { value: 10, emoji: '🥳', labelKey: 'outstanding', color: 'text-emerald-500' },
    ]

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 md:gap-4">
                {smileyFaces.map((smiley) => {
                    const isActive = (hoverRating || rating) >= smiley.value
                    const emojiSize = size === 32 ? 'text-2xl' : 'text-xl'
                    const emojiColor = isActive ? smiley.color : 'grayscale'

                    return (
                        <button
                            key={smiley.value}
                            type="button"
                            className={`
                                flex flex-col items-center p-2 rounded-lg transition-all duration-200 
                                hover:scale-110 hover:bg-gray-50 focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:ring-offset-2
                                ${isActive ? 'bg-blue-50 scale-105' : ''}
                            `}
                            onClick={() => onRatingChange(smiley.value)}
                            onMouseEnter={() => setHoverRating(smiley.value)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <span className={`${emojiSize} transition-all duration-200 ${emojiColor}`}>
                                {smiley.emoji}
                            </span>
                            <span className="text-xs text-center text-gray-600 mt-1 font-medium">
                                {smiley.value}
                            </span>
                        </button>
                    )
                })}
            </div>

            {rating > 0 && (
                <div className="text-center">
                    <span className="text-lg font-semibold text-gray-700">
                        {/* ✅ Use translation */}
                        {ratingLabels[smileyFaces.find((s) => s.value === rating)?.labelKey]} ({rating}/10)
                    </span>
                </div>
            )}
        </div>
    )
}
