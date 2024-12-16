import AssessmentsList from "./AssessmentsList";
import CreateAssessment from "@/components/CreateAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const Assessments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || ""); 

  const status = searchParams.get("status") || "active";

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
    <div className="px-3 md:px-32">
      <div className="block md:flex space-y-4 md:space-y-0 md:justify-between mt-10">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <CreateAssessment />
      </div>

      <div className="my-3">
        <div className="block md:flex space-y-4 md:space-y-0 md:justify-between md:items-center">
          <Input
            placeholder="Search"
            className="w-48"
            value={search}
            onChange={handleSearchChange}
          />
          <div className="flex gap-2">
            <Button
              variant={status === "active" ? "default" : "outline"}
              onClick={() => {
                searchParams.set("status", "active");
                setSearchParams(searchParams);
              }}
            >
              Active
            </Button>

            <Button
              variant={status === "inactive" ? "default" : "outline"}
              onClick={() => {
                searchParams.set("status", "inactive");
                setSearchParams(searchParams);
              }}
            >
              Inactive
            </Button>
          </div>
        </div>
      </div>

      <AssessmentsList search={search} />
    </div>
  );
};

export default Assessments;
