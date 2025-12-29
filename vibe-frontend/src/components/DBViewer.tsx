
export function DBViewer({ tables }: { tables: Record<string, any[]> }) {
    // If tables is undefined or empty, show a fallback message or default state
    const tableNames = tables ? Object.keys(tables) : [];
    const [selectedTable, setSelectedTable] = useState(tableNames[0] || '');

    // Update selected table if it becomes empty (e.g. data load) and wasn't set
    if (!selectedTable && tableNames.length > 0) {
        setSelectedTable(tableNames[0]);
    }

    if (tableNames.length === 0) {
        return (
            <div className="bg-gray-900 h-full flex flex-col items-center justify-center text-gray-500">
                <p>No tables found in database.</p>
            </div>
        );
    }

    const currentRows = tables[selectedTable] || [];

    return (
        <div className="bg-gray-900 h-full flex flex-col font-mono text-sm">
            <div className="p-3 border-b border-gray-700 font-bold bg-gray-800 text-gray-300">
                DATABASE EXPLORER
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Table sidebar */}
                <div className="w-48 bg-gray-800 p-2 border-r border-gray-700 overflow-y-auto">
                    <div className="text-xs text-gray-500 mb-2 uppercase font-semibold">Tables</div>
                    {tableNames.map(table => (
                        <div
                            key={table}
                            onClick={() => setSelectedTable(table)}
                            className={`p-2 cursor-pointer rounded mb-1 flex justify-between items-center ${selectedTable === table ? 'bg-purple-600/30 text-purple-300' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            <span>{table}</span>
                            <span className="text-xs opacity-50 bg-black/20 px-1.5 rounded-full">{tables[table].length}</span>
                        </div>
                    ))}
                </div>

                {/* Table data */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="text-purple-400">TABLE:</span> {selectedTable}
                        </h3>
                        <div className="text-xs text-gray-500">{currentRows.length} records</div>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        {currentRows.length === 0 ? (
                            <div className="text-gray-500 italic p-4 text-center">Table is empty</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-400">
                                        {Object.keys(currentRows[0]).map(key => (
                                            <th key={key} className="p-3 font-medium">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="p-3 text-gray-300">{String(val)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
