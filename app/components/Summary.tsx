import React from 'react'
import ScoreGuage from './ScoreGuage'
import ScoreBadge from './ScoreBadge';
const Category = ({title,score}: {title: string, score: number}) => {
  const textColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="resume-summary">
      <div className="category">
        <div className='flex flex-row gap-2 items-center justify-center'>
          <p className='text-2xl'>{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  )
}

const Summary = ({feedback}: {feedback: Feedback}) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGuage score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-gray-600 text-sm">This score is calculated based on the variables below</p>
        </div>
      </div>

      <Category title= "Tone & style" score={feedback.toneAndStyle.score} />
      <Category title= "Content" score={feedback.content.score} />
      <Category title= "Structure" score={feedback.structure.score} />

    </div>
  )
}

export default Summary
