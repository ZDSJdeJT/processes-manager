import { ModeToggle } from '@/components/mode-toggle';

function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="font-bold">Process Manager</h1>
      <ModeToggle />
    </header>
  );
}

export { Header };
