import { useState } from "react";
import Table from "./components/Table";
// import TableGrid from "./components/TableGrid";
import { dummyData } from "./mocks/dummyData ";

function App() {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">
        아이언트레인 25년 상반기 프론트엔드 과제
      </h1>
      <Table
        datas={dummyData}
        selectedId={selected}
        onSelectedId={(ids) => setSelected(ids)}
      />
    </div>
  );
}

export default App;
