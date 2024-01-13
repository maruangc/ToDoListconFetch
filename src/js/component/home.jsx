import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "font-awesome/css/font-awesome.min.css";

// let initialArray = [{ id: 0, label: "Initial task", done: false }];
let initialArray = [];
let nextId = initialArray.length;

const Home = () => {
  const [toDo, setTodo] = useState({ id: 0, label: "", done: false });
  const [editable, setEditable] = useState({ id: 0, label: "", done: false });
  const [tasks, setTasks] = useState(initialArray);
  const [message, setMessage] = useState("Welcome");

  const handleSubmit = (e) => {
    e.preventDefault(); //Previene que cargue nuevamente la pagina cuando el submit;
    if (toDo.label.trim().length === 0) {
      alert("No puede ingresar valores en blanco");
      cancelar();
      return;
    }
    if (tasks.find((item) => toDo.label === item.label)) {
      alert("Valor duplicado");
      return;
    }
    if (editable.label !== "") {
      //Si clic edit editable.task tiene el valor de la tarea
      editTasks();
      cancelar();
      return;
    }
    const updatedTasks = [
      ...tasks,
      { id: nextId++, label: toDo.label, done: toDo.done },
    ];
    cancelar();
    updateList(updatedTasks);
    return;
  };

  const editTasks = () => {
    //Editar
    const editedTasks = tasks.map((item) => {
      if (item.id === toDo.id) {
        return toDo;
      } else return item;
    });
    return updateList(editedTasks);
  };

  const removeTask = (e) => {
    //Remover
    const updatedTasks = tasks.filter((task) => e.id !== task.id);
    updateList(updatedTasks);
  };

  const cancelar = () => {
    //Cancela edicion
    setEditable({ id: 0, label: "", done: false });
    setTodo({ id: 0, label: "", done: false });
  };

  const edit = (e) => {
    //Preparar Editar
    setEditable(e);
    setTodo(e);
  };

  const chgDone = (e) => {
    //Cambia valor del tasks.done
    const editedTasks = tasks.map((item) => {
      if (item.id === e.id) {
        return {
          id: e.id,
          label: e.label,
          done: e.done,
        };
      } else return item;
    });
    return updateList(editedTasks);
  };

  //=Remote==========================================================
  const updateList = async (lista) => {
    if (lista.length == 0) {
      lista = initialArray;
    }
    const response = await fetch(
      "https://playground.4geeks.com/apis/fake/todos/user/maruangc",
      {
        method: "PUT",
        body: JSON.stringify(
          lista.map((item) => {
            return item;
          })
        ),
        headers: { "content-type": "application/json" },
      }
    );
    if (response.ok) {
      setTasks(lista);
      setMessage("Updated " + lista.length.toString() + " task(s)");
    } else {
      setMessage("Failed or user not exist");
    }
    console.log(response);
  };

  const createConnection = async () => {
    const response = await fetch(
      "https://playground.4geeks.com/apis/fake/todos/user/maruangc",
      {
        method: "POST",
        body: JSON.stringify([]),
        headers: { "content-type": "application/json" },
      }
    );
    console.log(response);
    if (response.ok) {
      getToDos();
      setMessage("User crated successfully");
    } else {
      setMessage("User already exist or failed connection");
    }
  };

  const getToDos = async () => {
    const response = await fetch(
      "https://playground.4geeks.com/apis/fake/todos/user/maruangc"
    );
    const listToDos = await response.json();
    if (response.ok) {
      setTasks(listToDos);
      setMessage(listToDos.length.toString() + " remote task(s) received");
    } else {
      setTasks(initialArray);
      setMessage(listToDos.msg);
    }
    console.log(response);
  };

  const deleteUser = async () => {
    const response = await fetch(
      "https://playground.4geeks.com/apis/fake/todos/user/maruangc",
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      }
    );
    setTasks(initialArray);
    setMessage(
      response.ok
        ? "User and their tasks have been deleted"
        : "Failed or user not exist"
    );
  };
  //=Fin=Remote==========================================================
  useEffect(() => {
    getToDos();
  }, []);
  return (
    <>
      <div className="container bg-primary mt-3 pb-1 border rounded-4">
        <div className="d-flex m-1 p-3 justify-content-end">
          <p className="me-4 text-light">Funciones fetch - usuario: maruangc</p>
          <button className="" onClick={createConnection}>
            Create
          </button>
          <button className="" onClick={getToDos}>
            Get
          </button>
          <button className="" onClick={deleteUser}>
            Delete
          </button>
        </div>
        <div className="d-flex justify-content-around">
          <div className="d-flex justify-content-center">
            <form onSubmit={handleSubmit}>
              <label className="text-light">
                {editable.label == "" ? "Task" : "Edit Task"}
                <input
                  className={`${
                    editable.label == "" ? "bg-light" : "bg-warning"
                  }`}
                  name="myInput"
                  value={toDo.label}
                  onChange={(e) =>
                    editable.label === ""
                      ? setTodo({
                          id: nextId++,
                          label: e.target.value,
                          done: false,
                        })
                      : setTodo({
                          id: toDo.id,
                          label: e.target.value,
                          done: toDo.done,
                        })
                  }
                />
              </label>
              <button type="submit">+</button>
            </form>
            {editable.task == "" ? (
              ""
            ) : (
              <button className="" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </div>
        {tasks.length > 0 ? (
          <div className="mt-2 mb-2">
            {tasks.map((task) => {
              return (
                <div
                  label
                  key={task.id}
                  className="d-flex justify-content-start text-light tasks"
                >
                  <div className="backing"></div>
                  <div className="Botones">
                    <button className="me-1" onClick={() => edit(task)}>
                      edit
                    </button>
                    <button className="" onClick={() => removeTask(task)}>
                      x
                    </button>
                  </div>
                  <div className="checkbox">
                    {/* ----------------------------------------------- */}
                    <input
                      type="checkbox"
                      namme="checkDone"
                      checked={task.done}
                      onChange={(e) =>
                        chgDone({
                          id: task.id,
                          label: task.label,
                          done: !task.done,
                        })
                      }
                    />
                    {/* --------------------------------------------- */}
                  </div>
                  <div className="ms-2">{task.label}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Lista vacia</div>
        )}
        <p className="text-start text-info bg-sucess m-0">
          #Tasks: {tasks.length}
        </p>
        <p className="text-start text-warning bg-sucess">{message}</p>
      </div>
    </>
  );
};

export default Home;
