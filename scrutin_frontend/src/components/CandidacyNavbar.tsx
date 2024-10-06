import TestProgress from "./TestProgress"
import { RainbowButton } from "./ui/rainbow-button"

const CandidacyNavbar = () => {
  return (
    <div className="w-full flex justify-around items-center">
      <div className="text-xl">Infintrix Technologies</div>
        <TestProgress/>
        <RainbowButton>Next</RainbowButton>
    </div>
  )
}

export default CandidacyNavbar