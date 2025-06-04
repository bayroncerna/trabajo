const students = [];

const form = document.getElementById("studentform");
const tablebody = document.querySelector("#studentTable tbody");
const promedios = document.getElementById("average");

const statsDiv = document.createElement("div");
statsDiv.id = "stats";
form.insertAdjacentElement("afterend", statsDiv);

const inputs = {
  name: form.querySelector("#name"),
  lastName: form.querySelector("#lastName"),
  grade: form.querySelector("#grade"),
};

let editIndex = null;

inputs.name.addEventListener("invalid", () => {
  if (inputs.name.validity.valueMissing) {
    inputs.name.setCustomValidity("Por favor Ponga su Nombre.");
  } else {
    inputs.name.setCustomValidity("");
  }
});
inputs.name.addEventListener("input", () => {
  inputs.name.setCustomValidity("");
});

inputs.lastName.addEventListener("invalid", () => {
  if (inputs.lastName.validity.valueMissing) {
    inputs.lastName.setCustomValidity("Por favor Ponga su apellido.");
  } else {
    inputs.lastName.setCustomValidity("");
  }
});
inputs.lastName.addEventListener("input", () => {
  inputs.lastName.setCustomValidity("");
});

inputs.grade.addEventListener("invalid", () => {
  if (inputs.grade.validity.valueMissing) {
    inputs.grade.setCustomValidity("Por favor Ponga Su Nota");
  } else if (
    inputs.grade.validity.rangeUnderflow ||
    inputs.grade.validity.rangeOverflow
  ) {
    inputs.grade.setCustomValidity("Por favor, ingrese una nota válida entre 1.0 y 7.0.");
  } else {
    inputs.grade.setCustomValidity("");
  }
});
inputs.grade.addEventListener("input", () => {
  inputs.grade.setCustomValidity("");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const student = {
    name: inputs.name.value.trim(),
    lastName: inputs.lastName.value.trim(),
    grade: parseFloat(inputs.grade.value),
  };

  if (editIndex !== null) {
    students[editIndex] = student;
    updateTable();
    editIndex = null;
  } else {
    students.push(student);
    addStudentToTable(student);
  }

  calcularPromedio();
  actualizarEstadisticas();

  form.reset();
  inputs.name.focus();
});

function addStudentToTable(student) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade.toFixed(1)}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Eliminar</button>
    </td>
  `;

  row.querySelector(".delete").addEventListener("click", function () {
    deleteEstudiante(student, row);
  });

  row.querySelector(".edit").addEventListener("click", function () {
    editIndex = students.indexOf(student);
    inputs.name.value = student.name;
    inputs.lastName.value = student.lastName;
    inputs.grade.value = student.grade;
  });

  tablebody.appendChild(row);
}

function updateTable() {
  tablebody.innerHTML = "";
  students.forEach((student) => {
    addStudentToTable(student);
  });
}

function calcularPromedio() {
  if (students.length === 0) {
    promedios.textContent = "Promedio General del Curso: N/A";
    return;
  }
  const total = students.reduce((sum, student) => sum + student.grade, 0);
  const prom = total / students.length;
  promedios.textContent = "Promedio General del Curso: " + prom.toFixed(1);
}

function actualizarEstadisticas() {
  const total = students.length;
  const aprobados = students.filter(s => s.grade >= 4.0).length;
  const reprobados = total - aprobados;

  const aprobadosPct = total > 0 ? ((aprobados / total) * 100).toFixed(1) : 0;
  const reprobadosPct = total > 0 ? ((reprobados / total) * 100).toFixed(1) : 0;

  statsDiv.innerHTML = `
    <p>Total de estudiantes: ${total}</p>
    <p>Porcentaje de aprobados: ${aprobadosPct}%</p>
    <p>Porcentaje de reprobados: ${reprobadosPct}%</p>
  `;
}

function deleteEstudiante(student, row) {
  const index = students.indexOf(student);
  if (index > -1) {
    students.splice(index, 1);
    row.remove();
    calcularPromedio();
    actualizarEstadisticas();
  }
}
