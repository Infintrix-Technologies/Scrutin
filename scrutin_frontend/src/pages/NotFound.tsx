import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex h-screen justify-center items-center'>
        <div className='flex flex-col items-center'>
            <Logo/>
            <span className='text-5xl font-extrabold'>
            404 Error | Page Not Found
            </span>
            <p className='my-6'>
            There's nothing here
            </p>
            <Link to={"/"}>
            <Button>Back to Home</Button>
            </Link>
        </div>
    </div>
  )
}

export default NotFound