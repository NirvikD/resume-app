import React from 'react'
import { useParams } from 'react-router';

const resume = () => {
    const {id} = useParams();

  return (
    <div>
      <h1>Resume ID: {id}</h1>
    </div>
  )
}

export default resume
