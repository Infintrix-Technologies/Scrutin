const Logo = () => {
  return (
    <>
      {/* <MountainIcon className="h-6 w-6" /> */}
      <div className="text-4xl font-afacad mb-2 group perspective">
        <div className="flex relative inline-block transform-gpu transition-transform duration-300 group-hover:rotate-y-180">
          <span className="block transition-colors duration-300 text-red-500 group-hover:text-blue-500">
            s
          </span>
          <span className="block transition-colors duration-300 text-orange-500 group-hover:text-green-500">
            c
          </span>
          <span className="block transition-colors duration-300 text-yellow-500 group-hover:text-purple-500">
            r
          </span>
          <span className="block transition-colors duration-300 text-green-500 group-hover:text-red-500">
            u
          </span>
          <span className="block transition-colors duration-300 text-blue-500 group-hover:text-orange-500">
            t
          </span>
          <span className="block transition-colors duration-300 text-indigo-500 group-hover:text-yellow-500">
            i
          </span>
          <span className="block transition-colors duration-300 text-violet-500 group-hover:text-blue-500">
            n
          </span>
        </div>
      </div>
      <span className="sr-only">Company Logo</span>
    </>
  );
};

export default Logo;
