import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Forbidden = () => {
  return (

<div className='flex h-screen justify-center items-center'>
        <div className='flex flex-col items-center'>
            <Logo/>
            <span className='text-5xl font-extrabold'>
            403 Error | Forbidden
            </span>
            <p className='my-6'>
            Access to this resource on the server is denied!
            </p>
            <Link to={"/"}>
            <Button>Back to Home</Button>
            </Link>
        </div>
    </div>


  )
}

export default Forbidden
