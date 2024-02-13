import { TextInput } from "flowbite-react";
import React from "react";

const Search = () => {
  return (
    <div>
      {/* sidebar */}
      <div>
        <form>
          <div>
            <label>Search Term:</label>
            <TextInput placeholder="Search..." id="search" type="text" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
