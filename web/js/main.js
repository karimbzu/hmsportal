let doctorChart;

async function fetchDoctors() {
    const resp = await fetch('/api/doctors');
    const data = await resp.json();

    const tbody = document.getElementById('doctorTable');
    const select = document.getElementById('patientDoctor');
    tbody.innerHTML = '';
    select.innerHTML = '';
    for (let key in data) {
        const d = data[key];

        // Table row
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.id}</td>
            <td><input type="text" value="${d.name}" id="doctorName${d.id}"></td>
            <td><input type="text" value="${d.specialty}" id="doctorSpecialty${d.id}"></td>
            <td>
                <button class="btn btn-sm btn-success" onclick="editDoctor(${d.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);

        // Dropdown for patients
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.text = d.name;
        select.appendChild(opt);
    }
}

async function fetchPatients() {
    const resp = await fetch('/api/patients');
    const data = await resp.json();

    const tbody = document.getElementById('patientTable');
    tbody.innerHTML = '';
    for (let key in data) {
        const p = data[key];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><input type="text" value="${p.name}" id="patientName${p.id}"></td>
            <td><input type="text" value="${p.disease}" id="patientDisease${p.id}"></td>
            <td>
                <select id="patientDoctorSelect${p.id}"></select>
            </td>
            <td>
                <button class="btn btn-sm btn-success" onclick="editPatient(${p.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);

        const select = document.getElementById(`patientDoctorSelect${p.id}`);
        const doctorResp = await fetch('/api/doctors');
        const doctors = await doctorResp.json();
        for (let k in doctors) {
            const opt = document.createElement('option');
            opt.value = doctors[k].id;
            opt.text = doctors[k].name;
            if (doctors[k].id === p.doctor_id) opt.selected = true;
            select.appendChild(opt);
        }
    }
}

async function addDoctor() {
    const name = document.getElementById('doctorName').value;
    const specialty = document.getElementById('doctorSpecialty').value;
    await fetch('/api/doctors/add', {
        method: 'POST',
        body: JSON.stringify({name, specialty}),
        headers: {'Content-Type': 'application/json'}
    });
    document.getElementById('doctorName').value = '';
    document.getElementById('doctorSpecialty').value = '';
    await reloadData();
}

async function editDoctor(id) {
    const name = document.getElementById(`doctorName${id}`).value;
    const specialty = document.getElementById(`doctorSpecialty${id}`).value;
    await fetch('/api/doctors/edit', {
        method: 'POST',
        body: JSON.stringify({id, name, specialty}),
        headers: {'Content-Type': 'application/json'}
    });
    await reloadData();
}

async function deleteDoctor(id) {
    await fetch('/api/doctors/delete', {
        method: 'POST',
        body: JSON.stringify({id}),
        headers: {'Content-Type': 'application/json'}
    });
    await reloadData();
}

async function addPatient() {
    const name = document.getElementById('patientName').value;
    const disease = document.getElementById('patientDisease').value;
    const doctor_id = parseInt(document.getElementById('patientDoctor').value);
    await fetch('/api/patients/add', {
        method: 'POST',
        body: JSON.stringify({name,disease,doctor_id}),
        headers: {'Content-Type':'application/json'}
    });
    document.getElementById('patientName').value = '';
    document.getElementById('patientDisease').value = '';
    await reloadData();
}

async function editPatient(id) {
    const name = document.getElementById(`patientName${id}`).value;
    const disease = document.getElementById(`patientDisease${id}`).value;
    const doctor_id = parseInt(document.getElementById(`patientDoctorSelect${id}`).value);
    await fetch('/api/patients/edit', {
        method:'POST',
        body: JSON.stringify({id,name,disease,doctor_id}),
        headers:{'Content-Type':'application/json'}
    });
    await reloadData();
}

async function deletePatient(id){
    await fetch('/api/patients/delete',{
        method:'POST',
        body: JSON.stringify({id}),
        headers:{'Content-Type':'application/json'}
    });
    await reloadData();
}

async function loadChart() {
    const resp = await fetch('/api/chart');
    const data = await resp.json();
    const ctx = document.getElementById('chart').getContext('2d');
    if (doctorChart) doctorChart.destroy();
    doctorChart = new Chart(ctx, {
        type:'bar',
        data:{
            labels:data.labels,
            datasets:[{
                label:'Patients per Doctor',
                data:data.counts,
                backgroundColor:'rgba(54,162,235,0.6)'
            }]
        },
        options:{responsive:true, maintainAspectRatio:false}
    });
}

async function reloadData() {
    await fetchDoctors();
    await fetchPatients();
    await loadChart();
}

window.onload = reloadData;
