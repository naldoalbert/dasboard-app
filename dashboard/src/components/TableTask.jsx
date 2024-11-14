import React, { useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";

export const TableTask = () => {
    const [tasks, setTasks] = useState([]);

    // Mendapatkan data tugas dari server saat komponen pertama kali dimuat
    useEffect(() => {
        const getTasks = async () => {
            try {
                const res = await axios.get("http://localhost/dashboard-app/api/index.php");
                setTasks(res.data);
                console.log(res.data);
            } catch (error) {
                console.error("Gagal mengambil tugas:", error);
            }
        };
        getTasks();
    }, []);

    // Mengubah status tugas menjadi complete atau incomplete
    const updateTask = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1; // Mengubah status antara 1 (complete) dan 0 (incomplete)
            const res = await fetch("http://localhost/dashboard-app/api/index.php", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: taskId, completed: newStatus }), // Mengirim status baru
            });
            const data = await res.json();
            console.log(data);

            // Memperbarui status tugas di dalam state tanpa merefresh halaman
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, completed: newStatus } : task
                )
            );
        } catch (error) {
            console.error("Gagal memperbarui tugas:", error);
        }
    };

    // Menghapus tugas dari server dan memperbarui daftar tugas di UI
    const deleteTask = async (taskId) => {
        try {
            const res = await fetch("http://localhost/dashboard-app/api/index.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: taskId }),
            });
            const data = await res.json();
            console.log(data);

            // Menghapus tugas dari state
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Gagal menghapus tugas:", error);
        }
    };

    return (
        <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
                <tr className="text-center">
                    <th className="border px-4 py-2 border-slate-400">ID</th>
                    <th className="border px-4 py-2 border-slate-400">Task</th>
                    <th className="border px-4 py-2 border-slate-400">Status</th>
                    <th className="border px-4 py-2 border-slate-400">Action</th>
                </tr>
            </thead>
            <tbody>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <tr className="text-center" key={task.id}>
                            <td className="border px-4 py-2 border-slate-400">{task.id}</td>
                            <td className="border px-4 py-2 border-slate-400">
                                {task.title}
                            </td>
                            <td className="border px-4 py-2 border-slate-400">
                                {task.completed ? "complete" : "incomplete"}
                            </td>
                            <td className="flex gap-3 justify-center border border-slate-400 h-full">
                                <Button
                                    className={"bg-green-500 w-fit"}
                                    onClick={() => updateTask(task.id, task.completed)}
                                >
                                    {task.completed ? "Mark Incomplete" : "Complete"}
                                </Button>
                                <Button
                                    className={"bg-red-500 w-fit"}
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan="4"
                            className="text-center py-4 border border-slate-400"
                        >
                            Tidak ada tugas
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};