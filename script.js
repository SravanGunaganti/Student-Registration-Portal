document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("student-form");
  const studentList = document.querySelector(".student-list");
  const nameElement = document.getElementById("name");
  const idElement = document.getElementById("student-id");
  const emailElement = document.getElementById("email");
  const contactElement = document.getElementById("contact");
  const studentTableBody = document.getElementById("student-table-body");
  const submitBtn = document.querySelector(".submit-btn");
  const cancelBtn = document.querySelector(".cancel");
  const emptyView = document.querySelector(".empty-view");
  const studentListHeading = document.querySelector(".student-list-heading");

  studentList.style.overflowY = "auto";
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = null;
  function renderStart(index = null) {
    editIndex = index;
    if (index !== null) {
      cancelBtn.style.display = "block";
      submitBtn.textContent = "Save Changes";
    } else {
      cancelBtn.style.display = "none";
      submitBtn.textContent = "Add Student";
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
  }
  function handleCancelChanges(e) {
    e.preventDefault();
    editIndex = null;
    studentForm.reset();
    renderStart();
    renderTable();
  }

  cancelBtn.addEventListener("click", handleCancelChanges);

  // Function to render the student data in the table
  function renderTable(scroll = false) {
    console.log(students, students.length);
    if (students.length > 0) {
      emptyView.style.display = "none";
      studentList.style.display = "block";
      studentListHeading.style.display = "block";
    } else {
      emptyView.style.display = "flex";
      studentList.style.display = "none";
      studentListHeading.style.display = "none";
      return;
    }
    studentTableBody.innerHTML = "";
    students?.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                
            `;

      const actionContainer = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit", "hover-edit");
      editBtn.innerHTML = `<i class=" fa-solid fa-pen-to-square"></i>`;
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete", "hover-delete");
      deleteBtn.innerHTML = `<i class="delete fa-solid fa-trash-can"></i>`;
      actionContainer.classList.add("action-container");

      if (editIndex === index) {
        editBtn.disabled = true;
        deleteBtn.disabled = true;
        editBtn.classList.remove("hover-edit");
        deleteBtn.classList.remove("hover-delete");

        actionContainer.style.opacity = "0.5";
      }

      editBtn.onclick = function () {
        editStudent(index);
      };

      deleteBtn.onclick = function () {
        deleteStudent(index);
      };
      actionContainer.appendChild(editBtn);
      actionContainer.appendChild(deleteBtn);
      row.appendChild(actionContainer);

      studentTableBody.appendChild(row);
      if (editIndex === index) {
        row.scrollIntoView();
      } else if (scroll && index === students.length - 1) {
        row.scrollIntoView();
      }
    });
  }
  // Function to add a new student
  function addStudent(event) {
    event.preventDefault();

    const name = nameElement.value.trim();
    const id = idElement.value.trim();
    const email = emailElement.value.trim();
    const contact = contactElement.value.trim();

    if (!name || !id || !email || !contact) {
      alert("All fields are required!");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Name must contain only letters.");
      return;
    }

    if (!/^\d+$/.test(id) || id.length > 10) {
      alert("Student ID must be numbers and ≤ 10 digits");
      return;
    }
    if (!/^\d+$/.test(contact) || contact.length !== 10) {
      alert("Contact must be numbers and 10 digits.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter a valid email.");
      return;
    }
    const isFound = students.find((student) => student.id === id);

    if (isFound) {
      if (editIndex === null) {
        alert("Student Id already exists");
        return;
      }
    }

    if (editIndex !== null) {
      students.splice(editIndex, 1, { name, id, email, contact });
    } else {
      students.push({ name, id, email, contact });
    }
    saveToLocalStorage();

    studentForm.reset();
    renderStart(null);
    renderTable(true);
  }

  // Function to edit a student record
  function editStudent(index) {
    const student = students[index];

    nameElement.value = student.name;
    idElement.value = student.id;
    emailElement.value = student.email;
    contactElement.value = student.contact;
    renderStart(index);
    renderTable();
    studentForm.scrollIntoView();
  }

  // Function to delete a student record
  function deleteStudent(index) {
    if (confirm("Are you sure want to delete this student?")) {
      students.splice(index, 1);
      saveToLocalStorage();

      studentForm.reset();
      renderStart();
      renderTable();
    } else {
      console.log("Cancelled!");
    }
  }

  // Handle form submission with event listener
  renderStart(editIndex);
  studentForm.addEventListener("submit", addStudent);
  renderTable();
});
