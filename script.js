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

  studentList.style.overflowY = "auto";

  // Getting stored student data from localStorage or initialize an empty array
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = null;
  // console.log(0 === null);
  function renderStart(index) {
    editIndex=index;
    if (index!==undefined & index!==null) {
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
    renderStart()
    renderTable();
  }

  cancelBtn.addEventListener("click", handleCancelChanges);

  // Function to render the student data in the table
  function renderTable() {
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

      actionContainer.style.display = "flex";
      actionContainer.style.gap = "16px";
      actionContainer.style.justifyContent = "space-evenly";
      actionContainer.style.alignItems="center"

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
      // submitBtn.textContent = "Add Student";
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

    if (!/^\d+$/.test(id) || id.length>10) {
      alert("Student ID must be numbers and ≤ 10 digits");
      return;
    }
    if (!/^\d+$/.test(contact) || contact.length!==10) {
      alert("Contact must be numbers and 10 digits.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter a valid email.");
      return;
    }
    if (editIndex !== null & editIndex!==undefined) {
      students.splice(editIndex, 1, { name, id, email, contact });
    } else {
      students.push({ name, id, email, contact });
    }
    saveToLocalStorage();

    studentForm.reset();
    renderStart(null)
    renderTable();
  }

  // Function to edit a student record
  function editStudent(index) {
    const student = students[index];

    nameElement.value = student.name;
    idElement.value = student.id;
    emailElement.value = student.email;
    contactElement.value = student.contact;
    // submitBtn.textContent = "Save Changes";
    renderStart(index);
    renderTable();
    
    
    
  }

  // confirm modal handle function
  function showConfirm(message, callback) {
    const modal = document.getElementById("confirm-modal");
    document.getElementById("confirm-text").textContent = message;

    modal.style.display = "block";

    document.getElementById("confirm-yes").onclick = () => {
      modal.style.display = "none";
      callback(true);
    };

    document.getElementById("confirm-no").onclick = () => {
      modal.style.display = "none";
      callback(false);
    };
  }

  // Function to delete a student record
  function deleteStudent(index) {
    showConfirm("Are you sure want to delete this Student?", function (result) {
      if (result) {
        students.splice(index, 1);
        saveToLocalStorage();

        studentForm.reset();
        renderStart()
        renderTable();
      } else {
        console.log("Cancelled!");
      }
    });

    // }
  }

  // Handle form submission with event listener
  renderStart(editIndex);
  studentForm.addEventListener("submit", addStudent);
  renderTable();
});
