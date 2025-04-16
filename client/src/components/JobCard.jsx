import React from 'react'
import { assets } from '../assets/assets'

const JobCard = ({ job }) => {

    return (
        <div className='border p-4 rounded-lg'>
            <h4 className='text-xl font-semibold'>{job.title}</h4>
            <p className='text-gray-600'>{job.company}</p>
            <p className='mt-2'>{job.location}</p>
            <p className='mt-2 text-gray-700'>{job.description}</p>
            <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Apply Now
                </button>
            </div>
        </div>
    )
}

export default JobCard;
