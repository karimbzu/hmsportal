async function loadDoctors(){
    const resp = await fetch('/api/doctors');
    const data = await resp.json();
    let html = "<table><tr><th>ID</th><th>Name</th><th>Specialty</th><th>Actions</th></tr>";
    for(let key in data){
        let doc = data[key];
        html += `<tr>
            <td>${doc.id}</td>
            <td>${doc.name}</td>
            <td>${doc.specialty}</td>
            <td>
                <button onclick="editDoctor(${doc.id})">Edit</button>
                <button onclick="deleteDoctor(${doc.id})">Delete</button>
            </td>
        </tr>`;
    }
    html += "</table>";
    document.getElementById('doctors').innerHTML = html;
}

async function addDoctor(){
    let name = prompt("Doctor Name:");
    let specialty = prompt("Specialty:");
    if(!name||!specialty) return;
    await fetch('/api/doctors/add',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, specialty})});
    loadDoctors(); loadChart();
}

async function editDoctor(id){
    let name = prompt("New Name:");
    let specialty = prompt("New Specialty:");
    if(!name||!specialty) return;
    await fetch('/api/doctors/edit',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,name,specialty})});
    loadDoctors(); loadChart();
}

async function deleteDoctor(id){
    if(!confirm("Delete doctor?")) return;
    await fetch('/api/doctors/delete',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
    loadDoctors(); loadPatients(); loadChart();
}

async function loadPatients(){
    const resp = await fetch('/api/patients');
    const data = await resp.json();
    let html = "<table><tr><th>ID</th><th>Name</th><th>Disease</th><th>Doctor ID</th><th>Actions</th></tr>";
    for(let key in data){
        let pat = data[key];
        html += `<tr>
            <td>${pat.id}</td>
            <td>${pat.name}</td>
            <td>${pat.disease}</td>
            <td>${pat.doctor_id}</td>
            <td>
                <button onclick="editPatient(${pat.id})">Edit</button>
                <button onclick="deletePatient(${pat.id})">Delete</button>
            </td>
        </tr>`;
    }
    html += "</table>";
    document.getElementById('patients').innerHTML = html;
}

async function addPatient(){
    let name = prompt("Patient Name:");
    let disease = prompt("Disease:");
    let doctor_id = prompt("Doctor ID:");
    if(!name||!disease||!doctor_id) return;
    await fetch('/api/patients/add',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,disease,doctor_id})});
    loadPatients(); loadChart();
}

async function editPatient(id){
    let name = prompt("New Name:");
    let disease = prompt("New Disease:");
    let doctor_id = prompt("Doctor ID:");
    if(!name||!disease||!doctor_id) return;
    await fetch('/api/patients/edit',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,name,disease,doctor_id})});
    loadPatients(); loadChart();
}

async function deletePatient(id){
    if(!confirm("Delete patient?")) return;
    await fetch('/api/patients/delete',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
    loadPatients(); loadChart();
}

let chart = null;
async function loadChart(){
    const resp = await fetch('/api/chart');
    const data = await resp.json();
    const labels = [], counts = [];
    for(let key in data){
        labels.push(data[key].doctor);
        counts.push(data[key].count);
    }
    const ctx = document.getElementById('chart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx,{
        type:'bar',
        data:{ labels, datasets:[{label:'Patients per Doctor', data:counts, backgroundColor:'rgba(54,162,235,0.6)'}] }
    });
}

// Load everything on page load
window.onload = () => { loadDoctors(); loadPatients(); loadChart(); };
