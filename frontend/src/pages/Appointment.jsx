import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Appointment = () => {
  
  // storing docid for a particular doctor to show the appointment details
  const {docId} = useParams()
  const {doctors} = useContext(AppContext)

  // creating state variable to store other info of a doctor
  const [docInfo, setDocInfo] = useState(null)

  // fetch other info of a doctor using the docId
  const fetchDocInfo = async() => {
    // if the doc._id from doctor list is equal to the docId, value will be stored in docInfo variable
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  //we've to run this function whenever page gets reloaded. when any of doctors or docId changes, this function will run
  useEffect(() => {
    fetchDocInfo()
  },[doctors, docId])

  return (
    <div>

    </div>
  )
}

export default Appointment