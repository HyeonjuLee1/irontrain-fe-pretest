import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import CheckBox from "./CheckBox";
import clsx from "clsx";
import { PersonInfo, SortConfig } from "../type";
import { InView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

interface TableProps {
  data: PersonInfo[];
  onSelectedId: (id: string[]) => void;
  selectedId: string[];
  onLoadMore: () => void;
  loading: boolean;
  onClickSort: (key: string, dir: string) => void;
  sortConfig: SortConfig;
}

const Table: React.FC<TableProps> = ({
  data,
  onSelectedId,
  selectedId,
  onLoadMore,
  loading,
  onClickSort,
  sortConfig,
}) => {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = cellRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, []);

  // 체크박스 관련
  const [allChecked, setAllChecked] = useState<"all" | "intermediate" | "none">(
    "none"
  );
  const newSelecteds = _.map(data, (d) => d.id);
  const numSelected = selectedId.length;
  const rowCount = newSelecteds.length;

  useEffect(() => {
    if (numSelected === 0) {
      setAllChecked("none");
    } else if (numSelected < rowCount) {
      setAllChecked("intermediate");
    } else if (numSelected === rowCount) {
      setAllChecked("all");
    }
  }, [rowCount, numSelected, data]);

  const handleSelectAllClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (allChecked === "all") {
        onSelectedId([]);
      } else {
        onSelectedId(_.map(data, (d) => d.uniqueId));
      }
    },
    [allChecked, data, onSelectedId]
  );

  const isSelected = useCallback(
    (id: string) => {
      return selectedId.indexOf(id) !== -1;
    },
    [selectedId]
  );

  const handleClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const selectedIndex = selectedId.indexOf(id);
      if (selectedIndex > -1) {
        onSelectedId(_.filter(selectedId, (s) => s !== id));
      } else {
        onSelectedId([...selectedId, id]);
      }
    },
    [onSelectedId, selectedId]
  );

  // 아코디언 관련
  const [openRow, setOpenRow] = useState<string | null>(null);

  const toggleAccordion = useCallback((id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  // sort 아이콘 관련
  const sortNameIconMarkup = useMemo(() => {
    if (sortConfig.key !== "firstname") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSort}
          onClick={() => onClickSort("firstname", "asc")}
        />
      );
    } else if (sortConfig.direction === "asc") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSortUp}
          onClick={() => onClickSort("firstname", "desc")}
        />
      );
    } else if (sortConfig.direction === "desc") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSortDown}
          onClick={() => onClickSort("firstname", "asc")}
        />
      );
    }
  }, [onClickSort, sortConfig.direction, sortConfig.key]);

  const sortEmailIconMarkup = useMemo(() => {
    if (sortConfig.key !== "email") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSort}
          onClick={() => onClickSort("email", "asc")}
        />
      );
    } else if (sortConfig.direction === "asc") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSortUp}
          onClick={() => onClickSort("email", "desc")}
        />
      );
    } else if (sortConfig.direction === "desc") {
      return (
        <FontAwesomeIcon
          className="ml-1 w-[15px] h-[15px] cursor-pointer"
          icon={faSortDown}
          onClick={() => onClickSort("email", "asc")}
        />
      );
    }
  }, [onClickSort, sortConfig.direction, sortConfig.key]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border border-gray-300 min-w-[90px]">
              <CheckBox
                indeterminate={allChecked === "intermediate"}
                checked={allChecked === "all"}
                onChange={handleSelectAllClick}
              />
            </th>
            <th className="p-3 border border-gray-300 min-w-[90px]">조회</th>
            <th className="p-3 border border-gray-300">
              <>
                <span>이름</span>
                {sortNameIconMarkup}
              </>
            </th>
            <th className="p-3 border border-gray-300">
              <>
                <span> 이메일</span>
                {sortEmailIconMarkup}
              </>
            </th>
            <th className="p-3 border border-gray-300">성별</th>
          </tr>
        </thead>

        {data.length === 0 && !loading ? (
          <tbody>
            <tr>
              <td colSpan={5} className="text-center p-10">
                검색결과가 없습니다.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {_.map(data, (d, index) => {
              const isItemSelected = isSelected(d.uniqueId);

              return (
                <React.Fragment key={d.uniqueId}>
                  <tr
                    key={`person-${d.id}`}
                    className={`odd:bg-white even:bg-gray-50 hover:bg-primary-hover ${clsx(
                      {
                        "!bg-primary-hover": openRow === d.uniqueId,
                      }
                    )}`}
                  >
                    <td className="p-3 border border-gray-300 text-center">
                      <CheckBox
                        key={d.id}
                        checked={isItemSelected}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.stopPropagation();
                          handleClick(e, d.uniqueId);
                        }}
                      />
                    </td>
                    <td className="p-3 border border-gray-300">
                      <button
                        onClick={() => toggleAccordion(d.uniqueId)}
                        className={`text-black ${clsx({
                          "!text-primary": openRow === d.uniqueId,
                        })}`}
                      >
                        {openRow === d.uniqueId ? "▼" : "▶"}
                      </button>
                    </td>
                    <td
                      className={`p-3 border border-gray-300 text-black truncate max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg overflow-hidden whitespace-nowrap text-ellipsis ${clsx(
                        {
                          "!text-primary": openRow === d.uniqueId,
                        }
                      )}`}
                      title={`${d.firstname} ${d.lastname}`}
                    >
                      {`${d.firstname} ${d.lastname}`}{" "}
                    </td>
                    <td
                      ref={cellRef}
                      className={`p-3 border border-gray-300 text-black truncate max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg overflow-hidden whitespace-nowrap text-ellipsis ${clsx(
                        {
                          "!text-primary": openRow === d.uniqueId,
                        }
                      )}`}
                      title={isOverflowing ? d.email : undefined}
                      // title={d.email}
                    >
                      {d.email}
                    </td>
                    <td
                      className={`p-3 border border-gray-300 text-black truncate overflow-hidden whitespace-nowrap text-ellipsis ${clsx(
                        {
                          "!text-primary": openRow === d.uniqueId,
                        }
                      )}`}
                      title={d.gender || "-"}
                    >
                      {d.gender || "-"}
                    </td>
                  </tr>
                  {openRow === d.uniqueId && (
                    <tr key={`adressid-${d.uniqueId}`}>
                      <td
                        colSpan={2}
                        className="p-3 border border-gray-300 text-center min-w-[180px]"
                      ></td>
                      <td className="p-3 border border-gray-300 font-bold">
                        주소
                      </td>
                      <td
                        colSpan={2}
                        className="p-3 border border-gray-300 font-bold truncate max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg  overflow-hidden whitespace-nowrap text-ellipsis"
                        title={
                          d.address
                            ? `${d.address.street} ${d.address.buildingNumber}, ${d.address.city}, ${d.address.zipcode}, ${d.address.country}`
                            : "-"
                        }
                      >
                        {d.address
                          ? `${d.address.street} ${d.address.buildingNumber}, ${d.address.city}, ${d.address.zipcode}, ${d.address.country}`
                          : "-"}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        )}
      </table>

      <InView
        as="div"
        onChange={(inView) => {
          inView && !loading && onLoadMore();
        }}
      >
        <div className="h-10 text-center m-3">
          {loading ? "로딩 중..." : ""}
        </div>
      </InView>
    </div>
  );
};

export default Table;
