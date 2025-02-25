import { OS } from '@/components/os';
import { Processes } from '@/components/processes';

function App() {
  return (
    <main className="flex flex-col gap-y-1.5">
      <OS />
      <Processes />
    </main>
  );
}

export default App;
