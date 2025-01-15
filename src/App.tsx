import { useCallback, useEffect, useState } from "react";
import Table from "./components/Table";
import { SearchInput } from "./components/SearchInput";
import _ from "lodash";
import { PersonInfo, SortConfig } from "./type";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filterPersons, setFilterPersons] = useState<PersonInfo[]>([]);
  const [count, setCount] = useState<number>(1);
  // 처음에는 정렬되어있지 않게 하기위한 고정값
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "uniqueId",
    direction: "asc",
  });

  const getPersonList = useCallback(async () => {
    setLoading(true);
    setSelected([]);

    try {
      const queryParams: any = {
        _quantity: 50,
        _gender: "female",
        _birthday_start: "2005-01-01",
      };

      const resp = await axios.get(
        `https://fakerapi.it/api/v2/persons?${new URLSearchParams(
          queryParams
        ).toString()}`
      );

      const enrichedData = resp.data.data.map((item: { id: any }) => ({
        ...item,
        // API로부터 받은 데이터 항목에 중복된 id 값이 포함되어 데이터가 제대로 구분되지 않는 문제 해결
        uniqueId: `${item.id}-${uuidv4()}`,
      }));

      setFilterPersons((prev) => [...prev, ...enrichedData]);
    } catch (error) {
      console.error("getPersonList err:", error);
    } finally {
      setLoading(false);
    }
    // 무한 스크롤을 위한 dependency
  }, [count]);

  useEffect(() => {
    if (search === "") {
      getPersonList();
    }
  }, [getPersonList, count, search]);

  const searchByName = useCallback(
    (searchKey: string) => {
      const lowercasedSearchKey = searchKey.toLowerCase();
      const results = _.filter(
        filterPersons,
        (d) =>
          _.includes(d.firstname.toLowerCase(), lowercasedSearchKey) ||
          _.includes(d.lastname.toLowerCase(), lowercasedSearchKey)
      );

      setFilterPersons(results);
    },
    [filterPersons]
  );

  // 정렬아이콘 핸들링
  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction } as SortConfig);
  };

  // 정렬 함수
  const sortData = useCallback(
    (selectKey: string, dir: string) => {
      setSearch("");
      const sortedData = [...filterPersons];
      if (sortConfig.key) {
        sortedData.sort((a, b) => {
          const aValue = a[selectKey as keyof PersonInfo];
          const bValue = b[selectKey as keyof PersonInfo];

          // 값이 undefined일 경우 처리하는 로직 추가
          if (aValue === undefined || bValue === undefined) {
            return 0;
          }

          if (aValue < bValue) {
            return dir === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return dir === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      setFilterPersons(sortedData);
    },
    [filterPersons, sortConfig]
  );
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
        loading={loading}
        data={filterPersons}
        selectedId={selected}
        onSelectedId={(ids) => setSelected(ids)}
        onLoadMore={() => {
          setCount((prev) => prev + 1);
        }}
        onClickSort={(key, dir) => {
          handleSort(key);
          sortData(key, dir);
        }}
        sortConfig={sortConfig}
      />
    </div>
  );
}

export default App;
