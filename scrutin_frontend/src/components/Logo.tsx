const Logo = () => {
  const letters = [
    { char: 's', baseColor: 'text-red-500', hoverColor: 'text-blue-500' },
    { char: 'c', baseColor: 'text-orange-500', hoverColor: 'text-green-500' },
    { char: 'r', baseColor: 'text-yellow-500', hoverColor: 'text-purple-500' },
    { char: 'u', baseColor: 'text-green-500', hoverColor: 'text-red-500' },
    { char: 't', baseColor: 'text-blue-500', hoverColor: 'text-orange-500' },
    { char: 'i', baseColor: 'text-indigo-500', hoverColor: 'text-yellow-500' },
    { char: 'n', baseColor: 'text-violet-500', hoverColor: 'text-blue-500' },
  ];

  return (
    <>
      <div className="text-4xl font-afacad mb-2 group perspective">
        <div className="flex relative transform-gpu transition-transform duration-300 group-hover:rotate-y-180">
          {letters.map(({ char, baseColor, hoverColor }) => (
            <span
              key={char}
              className={`block transition-colors duration-300 ${baseColor} group-hover:${hoverColor}`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <span className="sr-only">Company Logo</span>
    </>
  );
};

export default Logo;
