"use client";

import { Suspense } from 'react';
import ReviewForm from './user-reviewContent';

// A simple loading UI to show while the main component loads.
const Loading = () => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-600">🌀 Loading Activity...</h2>
        </div>
    );
};

export default function UserReviewPage() {

    return (
        <Suspense fallback={<Loading />}>
            <ReviewForm />
        </Suspense>
    );
}


