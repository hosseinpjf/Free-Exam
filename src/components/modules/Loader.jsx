import React from 'react'
import { ClimbingBoxLoader } from 'react-spinners'

function Loader({ position }) {
  return (
    <div className={position}>
      <ClimbingBoxLoader color="#878787" />
    </div>
  )
}

export default Loader