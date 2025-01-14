import React, { useCallback, useEffect } from "react";
import _ from "lodash";
import CheckBox from "./CheckBox";

interface TableRow {
  checked: boolean;
  type: string;
  name: string;
  id: number;
  status?: string;
}

interface TableProps {
  datas: TableRow[];
  onSelectedId: (id: number[]) => void;
  selectedId: number[];
}

const Table: React.FC<TableProps> = ({ datas, onSelectedId, selectedId }) => {
  // 체크박스 관련
  const [allChecked, setAllChecked] = React.useState<
    "all" | "intermediate" | "none"
  >("none");
  //   const [selectedId, setSelectedId] = React.useState<number[]>([]);
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
            <th className="p-3 border border-gray-300">구분</th>
            <th className="p-3 border border-gray-300">이름</th>
            <th className="p-3 border border-gray-300">아이디</th>
            <th className="p-3 border border-gray-300">상태</th>
          </tr>
        </thead>
        <tbody>
          {_.map(datas, (data, index) => {
            const isItemSelected = isSelected(data.id);

            return (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
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
                <td className="p-3 border border-gray-300">{"화살표"}</td>
                <td className="p-3 border border-gray-300 text-primary">
                  {data.type}
                </td>
                <td className="p-3 border border-gray-300">{data.name}</td>
                <td className="p-3 border border-gray-300">{data.id}</td>
                <td className="p-3 border border-gray-300 text-red-500">
                  {data.status || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
