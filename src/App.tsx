import { useCallback, useEffect, useState } from "react";
import Table from "./components/Table";
import { dummyData } from "./mocks/dummyData ";
import { SearchInput } from "./components/SearchInput";
import _ from "lodash";
import { PersonInfo } from "./type";
import axios from "axios";

function App() {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filterPersons, setFilterPersons] = useState<PersonInfo[]>([]);

  const getPersonList = useCallback(async () => {
    setLoading(true);
    setSelected([]);

    try {
      const queryParams: any = {
        _quantity: 5,
        _gender: "female",
        _birthday_start: "2005-01-01",
      };

      const resp = await axios.get(
        `https://fakerapi.it/api/v2/persons?${new URLSearchParams(
          queryParams
        ).toString()}`
      );

      setFilterPersons(resp.data.data);
    } catch (error) {
      console.error("getPersonList err:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // persons에 값이 없는 경우 즉, 처음 렌더 시에만 실행되도록 조건 추가
  useEffect(() => {
    getPersonList();
  }, [getPersonList]);

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
