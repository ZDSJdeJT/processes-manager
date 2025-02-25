import { useEffect, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { invoke } from '@tauri-apps/api/core';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Process = {
  id: string;
  name: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
  refresh,
}: DataTableProps<TData, TValue> & { refresh: () => void }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center">
        <Input
          placeholder="请输入进程 id"
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="请输入进程名称"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={refresh}
        >
          <RefreshCw />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>进程列表</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  无结果
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一页
        </Button>
      </div>
    </div>
  );
}

function Processes() {
  const [processes, setProcesses] = useState<Process[]>([]);

  const fetchData = async () => await invoke<Process[]>('processes');

  const refresh = async () => {
    setProcesses(await fetchData());
    toast.success('刷新成功');
  };

  const killProcess = async (process: Process) => {
    if (await invoke<boolean>('kill_process_by_id', { id: process.id })) {
      setProcesses(processes.filter(({ id }) => id !== process.id));
      toast.success(`结束进程 ${process.name} 成功！`);
      return;
    }
    toast.error(`结束进程 ${process.name} 失败！`);
  };

  useEffect(() => {
    (async () => {
      setProcesses(await fetchData());
    })();
  }, []);

  const columns: ColumnDef<Process>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            进程 id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <Badge>{row.getValue('id')}</Badge>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            进程名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: 'action',
      header: '操作',
      cell: ({ cell }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">结束</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要继续吗？</AlertDialogTitle>
              <AlertDialogDescription>请谨慎操作。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  killProcess(cell.row.original);
                }}
              >
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  return (
    <section>
      <DataTable columns={columns} data={processes} refresh={refresh} />
    </section>
  );
}

export { Processes };
