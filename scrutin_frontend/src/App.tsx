import { FrappeProvider } from "frappe-react-sdk";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  //   const [count, setCount] = useState(0)

  return (
    <div className="App">
      <FrappeProvider>
        <Button variant="secondary">Button</Button>
      </FrappeProvider>
    </div>
  );
}

export default App;
