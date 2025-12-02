import React from 'react'

function Loader() {
    return (
        <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
    )
}

export default Loader
