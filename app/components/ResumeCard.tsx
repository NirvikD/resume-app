import React from 'react'
import { Link } from 'react-router-dom';
const ResumeCard = ({ resume }:{resume:Resume}) => {
  return (
    <div>
      <Link to={`/resumes/${resume.id}`} className='resume-card animate-in fade-in duration-1000'>
        {resume.jobTitle}
      </Link>
    </div>
  )
}

export default ResumeCard
