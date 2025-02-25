import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function OS() {
  const [osName, setOSName] = useState('...');

  useEffect(() => {
    (async () => {
      // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
      setOSName(await invoke<string>('os_name'));
    })();
  }, []);

  return (
    <section>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>提示！</AlertTitle>
        <AlertDescription>{`您正在使用 ${osName} 操作系统。`}</AlertDescription>
      </Alert>
    </section>
  );
}

export { OS };
