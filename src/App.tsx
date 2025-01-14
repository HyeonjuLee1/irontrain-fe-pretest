import { useCallback, useState } from "react";
import Table from "./components/Table";
import { dummyData } from "./mocks/dummyData ";
import { SearchInput } from "./components/SearchInput";
import _ from "lodash";
import { PersonInfo } from "./type";

function App() {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterPersons, setFilterPersons] = useState<PersonInfo[]>(dummyData);

  const searchByName = useCallback((searchKey: string) => {
    const lowercasedSearchKey = searchKey.toLowerCase();
    const results = _.filter(
      dummyData,
      (d) =>
        _.includes(d.firstname.toLowerCase(), lowercasedSearchKey) ||
        _.includes(d.lastname.toLowerCase(), lowercasedSearchKey)
    );
    setFilterPersons(results);
  }, []);

  console.log("값 확인", filterPersons);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">
        아이언트레인 25년 상반기 프론트엔드 과제
      </h1>
      <div className="flex justify-end mb-4">
        <SearchInput
          placeholder="이름을 입력해주세요"
          value={search}
          onClick={() => {
            searchByName(search);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchByName(search);
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <Table
        datas={filterPersons}
        selectedId={selected}
        onSelectedId={(ids) => setSelected(ids)}
      />
    </div>
  );
}

export default App;
