import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { CandidatesList } from "@/components/CandidatesList";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";


const Candidates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || ""); 

    // Update the search parameters when the search term changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
  
      // Update the URL with the search term
      if (value) {
        searchParams.set("search", value);
      } else {
        searchParams.delete("search");
      }
      setSearchParams(searchParams);
    };
  
  return (
    <div className="px-32">
      <div className="flex justify-between mt-10">
        <h1 className="text-3xl font-bold">Candidate</h1>
        <Button>
          <FaPlus className="mr-2" />
          Create Candidate
        </Button>
      </div>

      <div className="my-3 flex justify-between">
        <div>
        <Input
            placeholder="Search"
            className="w-48"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="react_developer">React Developer</SelectItem>
                <SelectItem value="software_engineer">
                  Software Engineer
                </SelectItem>
                <SelectItem value="fullstack_developer">
                  Fullstack Developer
                </SelectItem>
                <SelectItem value="backend_developer">
                  Backend Developer
                </SelectItem>
                <SelectItem value="python_developer">
                  Python Developer
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Test" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="html5">HTML 5</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java_script">Java Script</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="apple">Accountant</SelectItem>
                <SelectItem value="banana">Activity Leader</SelectItem>
                <SelectItem value="blueberry">3D Animator</SelectItem>
                <SelectItem value="grapes">3D Modeller</SelectItem>
                <SelectItem value="pineapple">AI Engineer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <CandidatesList search={search}/>
      </div>
    </div>
  );
};
export default Candidates;
