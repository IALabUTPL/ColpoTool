import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { BasicPatient } from "../../types/types";

interface Props {
  data: BasicPatient[];
  onDelete?: (codigo: string) => void;
}

const PatientDataTable: React.FC<Props> = ({ data, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<BasicPatient>[]>(() => [
    {
      header: "Código de paciente",
      accessorKey: "record_code",
    },
    {
      header: "Nombre completo",
      accessorKey: "full_name",
    },
    {
      header: "Fecha de registro",
      accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
      id: "created_at",
    },
    {
      header: "Acciones",
      id: "actions",
      cell: ({ row }) => (
        <div className="btn-list">
          <Link
            to={`/patients/view/${row.original.codigo}`} // ✅ CORREGIDO
            className="btn btn-outline-primary btn-sm"
          >
            Ver ficha médica
          </Link>
          <button
            onClick={() => onDelete?.(row.original.codigo)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ], [onDelete]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="card-title">Pacientes Registrados</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar por nombre o código..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table card-table table-vcenter text-nowrap datatable">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDataTable;
