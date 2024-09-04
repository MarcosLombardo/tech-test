"use client";
import { INewBlock, INewBlockError } from "@/interface/block.interface";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { validateBlock } from "@/utils/validations";

function FormPage() {
  const initialData = {
    description: "",
    startDate: "",
    endDate: "",
    progress: 0,
  };

  const [newBlock, setNewBlock] = useState<INewBlock>(initialData);
  const [errors, setErrors] = useState<INewBlockError>(initialData);
  const router = useRouter();
  const params = useParams();

  const getBlock = async () => {
    const res = await fetch(`/api/blocks/${params.id}`);
    const data = await res.json();
    setNewBlock({
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      progress: data.progress,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBlock({ ...newBlock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateBlock(newBlock);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!params.id) {
      await createBlock();
    } else {
      updateBlock();
    }
  };

  const createBlock = async () => {
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlock),
      });
      const data = await res.json();

      if (res.status === 200) {
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error en el createBlock: ", error.message);
    }
  };

  const updateBlock = async () => {
    try {
      const res = await fetch(`/api/blocks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlock),
      });
      const data = await res.json();
      if (res.status === 200) {
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error en el updateBlock: ", error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro que deseas eliminar esta tarea?")) {
      const res = await fetch(`/api/blocks/${params.id}`, {
        method: "DELETE",
      });
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    if (params.id) {
      getBlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={handleSubmit} autoComplete="off">
        <header className="flex justify-between">
          <h1 className="font-bold text-xl">
            {!params.id ? "Crear Bloque" : "Editar Bloque"}
          </h1>
          {!params.id ? (
            ""
          ) : (
            <button
              type="button"
              className="bg-red-300 px-3 py-1 rounded-md"
              onClick={handleDelete}>
              Eliminar
            </button>
          )}
        </header>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="Descripción"
          className={`bg-gray-800 border-2 w-full p-4 rounded-lg my-4 focus:outline-none
            ${errors.description ? "border-red-300" : ""}
            ${!!params.id && "text-gray-600 cursor-auto"}`}
          onChange={handleChange}
          value={newBlock.description}
          readOnly={!!params.id}
        />
        <input
          type="date"
          name="startDate"
          id="startDate"
          placeholder="Fecha de inicio"
          className={`bg-gray-800 border-2 w-full p-4 rounded-lg my-4 focus:outline-none
            ${errors.startDate ? "border-red-300" : ""}`}
          onChange={handleChange}
          value={newBlock.startDate}
          max={newBlock.endDate || ""}
        />
        <input
          type="date"
          name="endDate"
          id="endDate"
          placeholder="Fecha de finalización"
          className={`bg-gray-800 border-2 w-full p-4 rounded-lg my-4 focus:outline-none
            ${errors.endDate ? "border-red-300" : ""}`}
          onChange={handleChange}
          value={newBlock.endDate}
          min={newBlock.startDate || ""}
        />
        <input
          type="number"
          name="progress"
          id="progress"
          placeholder="Progreso"
          className={`bg-gray-800 border-2 w-full p-4 rounded-lg my-4 focus:outline-none
            ${errors.progress ? "border-red-500" : ""}`}
          onChange={handleChange}
          value={newBlock.progress}
        />
        <button className="bg-green-600 px-4 py-2 rounded-lg" type="submit">
          {!params.id ? "Guardar Bloque" : "Actualizar Bloque"}
        </button>
      </form>
    </div>
  );
}

export default FormPage;
