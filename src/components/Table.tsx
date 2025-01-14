import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import CheckBox from "./CheckBox";
import clsx from "clsx";

type Address = {
  id: number;
  street: string;
  streetName: string;
  buildingNumber: string;
  city: string;
  zipcode: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
};

interface TableRow {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender?: string;
  address?: Address;
}

interface TableProps {
  datas: TableRow[];
  onSelectedId: (id: number[]) => void;
  selectedId: number[];
}

const Table: React.FC<TableProps> = ({ datas, onSelectedId, selectedId }) => {
  // 체크박스 관련
  const [allChecked, setAllChecked] = useState<"all" | "intermediate" | "none">(
    "none"
  );
  const newSelecteds = _.map(datas, (d) => d.id);
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
  }, [rowCount, numSelected, datas]);

  const handleSelectAllClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (allChecked === "all") {
        onSelectedId([]);
      } else {
        onSelectedId(_.map(datas, (d) => d.id));
      }
    },
    [allChecked, datas, onSelectedId]
  );

  const isSelected = useCallback(
    (id: number) => {
      return selectedId.indexOf(id) !== -1;
    },
    [selectedId]
  );

  const handleClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
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
  const [openRow, setOpenRow] = useState<number | null>(null);

  const toggleAccordion = useCallback((id: number) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border border-gray-300">
              <CheckBox
                indeterminate={allChecked === "intermediate"}
                checked={allChecked === "all"}
                onChange={handleSelectAllClick}
              />
            </th>
            <th className="p-3 border border-gray-300">조회</th>
            <th className="p-3 border border-gray-300">이름</th>
            <th className="p-3 border border-gray-300">이메일</th>
            <th className="p-3 border border-gray-300">성별</th>
          </tr>
        </thead>
        <tbody>
          {_.map(datas, (data, index) => {
            const isItemSelected = isSelected(data.id);

            return (
              <>
                <tr
                  key={index}
                  className={`odd:bg-white even:bg-gray-50 hover:bg-primary-hover ${clsx(
                    {
                      "!bg-primary-hover": openRow === data.id,
                    }
                  )}`}
                >
                  <td className="p-3 border border-gray-300 text-center">
                    <CheckBox
                      key={data.id}
                      checked={isItemSelected}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        handleClick(e, data.id);
                      }}
                    />
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      onClick={() => toggleAccordion(data.id)}
                      className={`text-black ${clsx({
                        "!text-primary": openRow === data.id,
                      })}`}
                    >
                      {openRow === data.id ? "▼" : "▶"}
                    </button>
                  </td>
                  <td
                    className={`p-3 border border-gray-300 text-black ${clsx({
                      "!text-primary": openRow === data.id,
                    })}`}
                  >{`${data.firstname} ${data.lastname}`}</td>
                  <td
                    className={`p-3 border border-gray-300 text-black ${clsx({
                      "!text-primary": openRow === data.id,
                    })}`}
                  >
                    {data.email}
                  </td>
                  <td
                    className={`p-3 border border-gray-300 text-black ${clsx({
                      "!text-primary": openRow === data.id,
                    })}`}
                  >
                    {data.gender || "-"}
                  </td>
                </tr>
                {openRow === data.id && (
                  <tr>
                    <td
                      colSpan={2}
                      className="p-3 border border-gray-300 text-center"
                    ></td>
                    <td className="p-3 border border-gray-300 font-bold">
                      주소
                    </td>
                    <td colSpan={2} className="p-3 border border-gray-300">
                      {data.address
                        ? `${data.address.street} ${data.address.buildingNumber}, ${data.address.city}, ${data.address.zipcode}, ${data.address.country}`
                        : "-"}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
