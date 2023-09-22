import "./App.css";

function App() {
  return (
    <div className="w-full max-w-lg h-full bg-red-500 flex flex-col justify-center items-center">
      <div className="h-60 bg-slate-600 w-full pt-24">
        <div className="w-full h-full bg-green-600"></div>
      </div>
      <div className="flex-1 w-full flex justify-center items-center">
        <canvas className="w-3/4 aspect-square bg-black"></canvas>
      </div>
      <div className="h-40 bg-slate-600 w-full flex flex-col justify-start items-center gap-2 pt-2">
        <div className="text-white">Ban co 1000 luot</div>
        <div className="w-64 h-20 bg-green-600"></div>
      </div>
    </div>
  );
}

export default App;
