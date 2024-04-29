const myTableData = [];
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const modal = new bootstrap.Modal(document.getElementById('modalId'));
const form = document.querySelector('form');
const employeeContainer = document.getElementById('employeeContainer');
let editing = false;
updateBtn.style.display = 'none';

let myTable = new DataTable('#myTable', {
    data: myTableData,
    columns: [
        {
            render: data => `<button type="button" class="btn btn-sm btn-secondary" onclick="openChild(this)">></button>`
        },
        { data: 'deptName' },
        { data: 'deptDescription' },
        { data: 'totalDeptEmployees' },
        { data: 'totalDeptSalary' },
        { data: 'stateCity' },
        {
            render: data => `<div class="d-flex"><button type="button" class="btn btn-sm btn-secondary mx-1" onclick="editData(this)">Edit</button><button type="button" class="btn btn-sm btn-secondary mx-1" onclick="deleteData(this)">Delete</button></div>`
        }
    ]
});

var employeeRowCounter = 2;
//Add Employee Row in form
function addEmployeeRow() {
    if (employeeRowCounter < 10) {
        let newRow = document.createElement('div');
        newRow.setAttribute('class', 'form-row d-flex employee-form-row flex-wrap');
        newRow.innerHTML = ` <div class="mb-3 col d-flex flex-column">
            <label for="employeeName" class="col-4 col-form-label">Employee Name</label>
            <div class="col-8">
                <input type="text" class="form-control" name="employeeName" id="employeeName${employeeRowCounter}" placeholder=""
                    pattern="[A-Za-z]+" required/>
                    <div class="invalid-feedback">Enter Valid Name</div>
            </div>
        </div>
        <div class="mb-3 col d-flex flex-column">
            <label for="dob" class="col-4 col-form-label">Date of Birth</label>
            <div class="col-8">
                <input type="date" class="form-control" name="dob" id="dob${employeeRowCounter}" placeholder="" max="2006-04-09" min="1960-04-09" required/>
                <div class="invalid-feedback">Enter Valid Age</div>
            </div>
        </div>
        <div class="mb-3 col d-flex flex-column">
            <label for="salary" class="col-4 col-form-label">Salary</label>
            <div class="col-8">
                <input type="number" class="form-control" name="salary" id="salary${employeeRowCounter}" placeholder="" min="1" required/>
                <div class="invalid-feedback">Enter Valid Salary</div>
            </div>
        </div>
        <div class="mb-3 col d-flex flex-column">
            <label for="joiningDate" class="col-4 col-form-label">Joining Date</label>
            <div class="col-8">
                <input type="month" class="form-control" name="joiningDate" id="joiningDate${employeeRowCounter}" placeholder=""  max="2024-04" min="2014-06" required/>
                <div class="invalid-feedback">Enter Valid Value</div>
            </div>
        </div>    
        <div class="mb-3 col d-flex flex-column">
            <label for="email" class="col-4 col-form-label">Email</label>
            <div class="col-8">
                <input type="email" class="form-control" name="email" id="email${employeeRowCounter}" placeholder="" required/>
                <div class="invalid-feedback">Enter Valid Email</div>
            </div>
        </div>
        <div class="mb-3 col d-flex flex-column">
            <label for="address" class="col-4 col-form-label">Address</label>
            <div class="col-8">
                <textarea type="text" class="form-control" name="address"
                    id="address${employeeRowCounter}" placeholder="" pattern="[A-Za-z]+"></textarea>
                <div class="invalid-feedback">Enter Valid Address</div>
            </div>
        </div>
        <div><button type="button" class="btn btn-sm btn-danger" onclick="deleteEmployeeRow(this)">-</button></div>
        `;
        employeeRowCounter++;
        employeeContainer.appendChild(newRow);

        document.querySelectorAll('.employee-form-row').forEach(function (row, index) {
            row.id = 'employeeFormRow' + (index + 1);
        })

    }
    else {
        alert('Only 10 rows are allowed')
    }
}

//Delete Employee Row from form
function deleteEmployeeRow(element) {
    const employeeRowToBeDeleted = element.parentNode.parentNode;
    employeeContainer.removeChild(employeeRowToBeDeleted);
    employeeRowCounter--;

    document.querySelectorAll('.employee-form-row').forEach(function (row, index) {
        row.id = 'employeeFormRow' + (index + 1);
    })
}

//Child Table Toggle
function openChild(element) {
    let row = element.parentNode.parentNode;
    let tableRow = myTable.row(row);
    let tableRowData = myTable.row(row).data();

    if (tableRow.child.isShown()) {
        tableRow.child.hide();
        element.textContent = '>'
    } else {
        tableRow.child(createChildTable(tableRowData)).show();
        element.textContent = 'v'
    }
}

//Function to create Child Table
function createChildTable(data) {
    let childTable = `<table class="table" id='childTable'>
       <thead>
           <tr>
               <th scope="col"></th>
               <th scope="col">Employee Name</th>
               <th scope="col">Age</th>
               <th scope="col">Experience</th>
               <th scope="col">Salary</th>
               <th scope="col">Email</th>
               <th scope="col">Address</th>
           </tr>
       </thead>
       <tbody>`

    let serialNumber = 1;

    data.employees.forEach(employee => {
        childTable += `<tr>
        <td>${serialNumber++}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.age}</td>
        <td>${employee.experience}</td>
        <td>${employee.salary}</td>
        <td>${employee.email}</td>
        <td>${employee.address}</td>
    </tr>`
    });

    childTable += `</tbody></table>`

    return childTable;
}

let counter = 0;
let totalSalary = 0;
let selectedCity;

function calculateYearsFromDate(givenDate) {
    let dateGiven = new Date(givenDate);
    let dateToday = new Date();
    let dateDiff = dateToday - dateGiven;
    let years = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 365.25));
    let months = Math.floor((dateDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30));

    return {
        years: years,
        months: months
    }
}

document.getElementById('cityOfState1').style.setProperty('display', 'none', 'important');
document.getElementById('cityOfState2').style.setProperty('display', 'none', 'important');

function chooseCity() {
    let selectedState = document.getElementById('state').value;
    if (selectedState === 'Gujarat') {
        document.getElementById('cityOfState1').style.setProperty('display', 'block', 'important');
        document.getElementById('cityOfState2').style.setProperty('display', 'none', 'important');
    } else if (selectedState === 'Rajasthan') {
        document.getElementById('cityOfState1').style.setProperty('display', 'none', 'important');
        document.getElementById('cityOfState2').style.setProperty('display', 'block', 'important');
    }
}

//Handling submit
form.addEventListener('submit', function (e) {
    e.preventDefault();

    document.querySelectorAll('.employee-form-row').forEach(formRow => {
        let salary = parseInt(document.querySelector('[name="salary"]').value);
        totalSalary += salary;
        counter++;
    });

    if (!editing) {

        let selectedState = document.getElementById('state').value;
        if (selectedState === 'Gujarat') {
            selectedCity = document.getElementById('city1').value;
        } else if (selectedState === 'Rajasthan') {
            selectedCity = document.getElementById('city2').value;
        }

        stateCityFormat = selectedCity + '|' + selectedState;

        let dataToBeAdded = {
            deptName: document.getElementById('deptName').value,
            deptDescription: document.getElementById('deptDescription').value,
            totalDeptEmployees: `${counter}`,
            totalDeptSalary: totalSalary,
            state: document.getElementById('state').value,
            city: selectedCity,
            stateCity: stateCityFormat,
            employees: []
        }

        document.querySelectorAll('.employee-form-row').forEach(itemRow => {
            let joiningDate = itemRow.querySelector('[name="joiningDate"]').value;
            let experience = calculateYearsFromDate(joiningDate).years + '.' + calculateYearsFromDate(joiningDate).months;
            dataToBeAdded.employees.push({
                employeeName: itemRow.querySelector('[name="employeeName"]').value,
                dob: itemRow.querySelector('[name="dob"]').value,
                age: calculateYearsFromDate(itemRow.querySelector('[name="dob"]').value).years,
                joiningDate: itemRow.querySelector('[name="joiningDate"]').value,
                experience: experience,
                salary: itemRow.querySelector('[name="salary"]').value,
                email: itemRow.querySelector('[name="email"]').value,
                address: itemRow.querySelector('[name="address"]').value,
            })
        });

        myTable.row.add(dataToBeAdded).draw().node();
        myTableData.push(dataToBeAdded);
        console.log(myTableData)
    }
    modal.hide();
    form.reset();
});

let rowToBeEdited;
let tablerowToBeEdited;
let tablerowToBeEditedIndex;


//Fetching Old Values
function editData(element) {
    submitBtn.style.display = 'none';
    updateBtn.style.display = 'block';

    rowToBeEdited = element.parentNode.parentNode.parentNode;
    tablerowToBeEdited = myTable.row(rowToBeEdited).data();
    console.log(tablerowToBeEdited)
    tablerowToBeEditedIndex = myTable.row(rowToBeEdited).index();
    modal.show();

    editing = true;

    document.getElementById('deptName').value = tablerowToBeEdited.deptName;
    document.getElementById('deptDescription').value = tablerowToBeEdited.deptDescription;
    document.getElementById('state').value = tablerowToBeEdited.state;
    document.getElementById('city1').value = tablerowToBeEdited.city;
    document.getElementById('city2').value = tablerowToBeEdited.city;

    let count = 1;
    tablerowToBeEdited.employees.forEach(employees => {
        document.getElementById('employeeName' + count).value = employees.employeeName;
        document.getElementById('dob' + count).value = employees.dob;
        document.getElementById('joiningDate' + count).value = employees.joiningDate;
        document.getElementById('salary' + count).value = employees.salary;
        document.getElementById('email' + count).value = employees.email;
        document.getElementById('address' + count).value = employees.address;
        count++;
    });

    //Setting Editing flag false if close without editing
    document.getElementById('modalId').addEventListener('hidden.bs.modal', function () {
        editing = false;
        form.reset();
        submitBtn.style.display = 'block';
        updateBtn.style.display = 'none';
    });
}

updateBtn.addEventListener('click', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        alert('Fill all values and in required format!');
        return; // Prevent further execution if the form is invalid
    }

    let updatedSelectedState = document.getElementById('state').value;
    if (updatedSelectedState === 'Gujarat') {
        updatedSelectedCity = document.getElementById('city1').value;
    } else if (updatedSelectedState === 'Rajasthan') {
        updatedSelectedCity = document.getElementById('city2').value;
    }

    updatedStateCityFormat = updatedSelectedCity + '|' + updatedSelectedState;

    let updatedData = {
        deptName: document.getElementById('deptName').value,
        deptDescription: document.getElementById('deptDescription').value,
        totalDeptEmployees: `${counter}`,
        totalDeptSalary: totalSalary,
        state: document.getElementById('state').value,
        city: updatedSelectedCity,
        stateCity: updatedStateCityFormat,
        employees: []
    }

    document.querySelectorAll('.employee-form-row').forEach(itemRow => {
        let updatedJoiningDate = itemRow.querySelector('[name="joiningDate"]').value;
        let updatedExperience = calculateYearsFromDate(updatedJoiningDate).years + '.' + calculateYearsFromDate(updatedJoiningDate).months;
        updatedData.employees.push({
            employeeName: itemRow.querySelector('[name="employeeName"]').value,
            age: calculateYearsFromDate(itemRow.querySelector('[name="dob"]').value).years,
            dob: itemRow.querySelector('[name="dob"]').value,
            joiningDate: itemRow.querySelector('[name="joiningDate"]').value,
            experience: updatedExperience,
            salary: itemRow.querySelector('[name="salary"]').value,
            email: itemRow.querySelector('[name="email"]').value,
            address: itemRow.querySelector('[name="address"]').value,
        });
    });

    myTableData[tablerowToBeEditedIndex] = updatedData;
    myTable.clear().rows.add(myTableData).draw();
    modal.hide();
    editing = false;
    form.reset();
});


//Deleting row from Data Table and Array
function deleteData(element) {
    rowToBeDeleted = element.parentNode.parentNode.parentNode;
    let trIndex = myTable.row(rowToBeDeleted).index();
    if (confirm('Delete Confirmation')) {
        myTable.row(rowToBeDeleted).remove().draw(false);
        myTableData.splice(trIndex, 1);
    }

}
