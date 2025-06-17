import { useForm } from "react-hook-form";
import { useEffect } from "react";

type SearchFormData = {
  searchQuery: string;
};

function SearchBox() {
  const { register, watch } = useForm<SearchFormData>();

  const searchValue = watch("searchQuery");

  useEffect(() => {
    if (searchValue) {
      console.log("User is typing:", searchValue);
      // You can debounce here if needed or trigger filtering, search, etc.
    }
  }, [searchValue]);

  return (
    <div className="h-[440px] w-[664px] bg-[var(--color-bg-searchbox)] rounded-2xl p-6 flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-4">Search</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          id="searchQuery"
          {...register("searchQuery")}
          placeholder="Type to search..."
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </form>
    </div>
  );
}

export default SearchBox;
