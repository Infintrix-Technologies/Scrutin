import { Link } from "react-router-dom"

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>

      <nav className="flex bg-pink-800 p-4 text-white">

        <Link to={"/"} className="logo font-bold mr-4">
          Scrutin
        </Link>
        <ul className="flex justify-between list-none w-48">
          <Link className="hover:bg-black cursor-pointer" to={"assessments"}><li>Assessments</li></Link>
          <Link className="hover:bg-black cursor-pointer" to={"candidates"}><li>Candidates</li></Link>
          <Link className="hover:bg-black cursor-pointer" to={"jobs"}><li>Jobs</li></Link>

        </ul>
      </nav>

      {children}


    </div>
  )
}

export default MainLayout