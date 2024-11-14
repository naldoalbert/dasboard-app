import React, { useState } from "react";
import Button from "./Button";

export const FormTask = () => {
    const [task, setTask] = useState({
        title: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Menangani proses penambahan tugas baru
    const handleAddTasks = async (e) => {
        e.preventDefault();

        // Validasi input agar judul tugas tidak kosong
        if (!task.title) {
            setError("Judul tugas harus diisi!");
            return;
        }

        setIsSubmitting(true); // Menandai bahwa proses sedang berjalan
        setError(null); // Reset pesan kesalahan

        try {
            // Kirim permintaan POST ke server untuk menambah tugas
            const res = await fetch("http://localhost/dashboard-app/api/index.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });

            if (!res.ok) {
                throw new Error("Gagal menambah tugas");
            }

            const data = await res.json();
            window.location.reload(); // Refresh halaman setelah tugas berhasil ditambah
            console.log(data);

            setTask({ title: "" }); // Mengosongkan input setelah tugas ditambahkan
        } catch (err) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan saat menambah tugas.");
        } finally {
            setIsSubmitting(false); // Mengakhiri proses submit
        }
    };

    return (
        <form
            onSubmit={handleAddTasks}
            id="createTaskForm"
            className="mb-4 flex gap-3 items-center"
        >
            <input
                className="p-2 border-2 border-gray-400 rounded-lg flex-grow"
                type="text"
                id="taskInput"
                value={task.title}
                placeholder="Masukkan tugas baru"
                onChange={(e) => setTask({ title: e.target.value })}
                required
            />

            <Button
                className="bg-blue-500 text-white p-2 w-32 rounded-md"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Menambahkan..." : "Tambah Tugas"}
            </Button>

            {/* Menampilkan pesan kesalahan jika ada */}
            {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
        </form>
    );
};