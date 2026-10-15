// Core State Manager & Seed Data
const defaultServices = [
    { id: 'blood_test', name: 'Complete Blood Count (CBC)', cost: 45 },
    { id: 'xray', name: 'Chest X-Ray', cost: 120 },
    { id: 'mri', name: 'MRI Scan', cost: 650 },
    { id: 'pharmacy', name: 'Prescription Medication Bundle', cost: 85 },
    { id: 'icu', name: 'ICU Admission Charge (per day)', cost: 1200 },
    { id: 'general_ward', name: 'General Ward Stay (per day)', cost: 250 }
];

const seedDoctors = [
    { id: 'doc-1', name: 'Dr. Jane Smith', specialty: 'Cardiology', phone: '+1 555-0199', consultation: 150, schedule: 'Mon, Wed, Fri 09:00 - 15:00' },
    { id: 'doc-2', name: 'Dr. Marcus Vance', specialty: 'Pediatrics', phone: '+1 555-0144', consultation: 120, schedule: 'Mon-Thu 10:00 - 17:00' },
    { id: 'doc-3', name: 'Dr. Sarah Lin', specialty: 'Neurology', phone: '+1 555-0188', consultation: 200, schedule: 'Tue, Thu 08:00 - 14:00' }
];

const seedPatients = [
    { id: 'pat-1', name: 'John Doe', age: 45, gender: 'Male', phone: '+1 555-4321', history: 'Type-2 Diabetes, Penicillin Allergy' },
    { id: 'pat-2', name: 'Mary Johnson', age: 31, gender: 'Female', phone: '+1 555-8765', history: 'Post-operative recovery from appendectomy' },
    { id: 'pat-3', name: 'Robert Carter', age: 62, gender: 'Male', phone: '+1 555-9087', history: 'Hypertension management' }
];

const seedAppointments = [
    { id: 'apt-1', patientId: 'pat-1', doctorId: 'doc-1', date: '2026-07-29T10:00', purpose: 'Regular cardiac follow-up', status: 'completed' },
    { id: 'apt-2', patientId: 'pat-2', doctorId: 'doc-2', date: '2026-07-29T14:30', purpose: 'Child wellness check', status: 'scheduled' },
    { id: 'apt-3', patientId: 'pat-3', doctorId: 'doc-3', date: '2026-07-30T11:00', purpose: 'Neurological evaluation', status: 'scheduled' }
];

const seedBills = [
    { id: 'inv-1001', patientId: 'pat-1', doctorId: 'doc-1', date: '2026-07-29', services: ['blood_test', 'pharmacy'], amount: 280, status: 'paid' },
    { id: 'inv-1002', patientId: 'pat-2', doctorId: 'doc-2', date: '2026-07-29', services: ['xray'], amount: 240, status: 'pending' }
];

class HMSApp {
    constructor() {
        this.initializeData();
        this.setupEventListeners();
        this.renderAll();
    }

    initializeData() {
        if (!localStorage.getItem('hms_doctors')) {
            localStorage.setItem('hms_doctors', JSON.stringify(seedDoctors));
        }
        if (!localStorage.getItem('hms_patients')) {
            localStorage.setItem('hms_patients', JSON.stringify(seedPatients));
        }
        if (!localStorage.getItem('hms_appointments')) {
            localStorage.setItem('hms_appointments', JSON.stringify(seedAppointments));
        }
        if (!localStorage.getItem('hms_bills')) {
            localStorage.setItem('hms_bills', JSON.stringify(seedBills));
        }
        
        this.doctors = JSON.parse(localStorage.getItem('hms_doctors'));
        this.patients = JSON.parse(localStorage.getItem('hms_patients'));
        this.appointments = JSON.parse(localStorage.getItem('hms_appointments'));
        this.bills = JSON.parse(localStorage.getItem('hms_bills'));
    }

    saveState(key) {
        localStorage.setItem(`hms_${key}`, JSON.stringify(this[key]));
        this.renderAll();
    }

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                this.switchTab(target);
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            const iconSvg = document.getElementById('theme-toggle-btn').querySelector('svg');
            if (newTheme === 'dark') {
                iconSvg.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
            } else {
                iconSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
            }
        });

        // Search inputs
        document.getElementById('search-patients').addEventListener('input', (e) => this.renderPatients(e.target.value));
        document.getElementById('search-doctors').addEventListener('input', (e) => this.renderDoctors(e.target.value));
        document.getElementById('search-appointments').addEventListener('input', (e) => this.renderAppointments(e.target.value));
        document.getElementById('search-billing').addEventListener('input', (e) => this.renderBilling(e.target.value));

        // Register new item buttons
        document.getElementById('btn-add-patient').addEventListener('click', () => {
            document.getElementById('patient-form').reset();
            document.getElementById('patient-id-field').value = '';
            document.getElementById('patient-modal-title').textContent = 'Register Patient';
            openModal('patientModal');
        });

        document.getElementById('btn-add-doctor').addEventListener('click', () => {
            document.getElementById('doctor-form').reset();
            document.getElementById('doctor-id-field').value = '';
            document.getElementById('doctor-modal-title').textContent = 'Add Doctor';
            openModal('doctorModal');
        });

        document.getElementById('btn-book-appointment').addEventListener('click', () => {
            document.getElementById('appointment-form').reset();
            document.getElementById('appointment-id-field').value = '';
            document.getElementById('appointment-modal-title').textContent = 'Book Appointment';
            this.populateSelectsForAppointment();
            openModal('appointmentModal');
        });

        document.getElementById('btn-create-invoice').addEventListener('click', () => {
            document.getElementById('billing-form').reset();
            this.populateSelectsForBilling();
            this.updateBillingTotal();
            openModal('billingModal');
        });

        // Form Submit Listeners
        document.getElementById('patient-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('patient-id-field').value;
            const patientData = {
                id: id || 'pat-' + Date.now(),
                name: document.getElementById('patient-name').value,
                age: parseInt(document.getElementById('patient-age').value),
                gender: document.getElementById('patient-gender').value,
                phone: document.getElementById('patient-phone').value,
                history: document.getElementById('patient-history').value
            };

            if (id) {
                const index = this.patients.findIndex(p => p.id === id);
                this.patients[index] = patientData;
            } else {
                this.patients.push(patientData);
            }
            this.saveState('patients');
            closeModal('patientModal');
        });

        document.getElementById('doctor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('doctor-id-field').value;
            const doctorData = {
                id: id || 'doc-' + Date.now(),
                name: document.getElementById('doctor-name').value,
                specialty: document.getElementById('doctor-specialty').value,
                phone: document.getElementById('doctor-phone').value,
                consultation: parseFloat(document.getElementById('doctor-consultation').value),
                schedule: document.getElementById('doctor-schedule').value
            };

            if (id) {
                const index = this.doctors.findIndex(d => d.id === id);
                this.doctors[index] = doctorData;
            } else {
                this.doctors.push(doctorData);
            }
            this.saveState('doctors');
            closeModal('doctorModal');
        });

        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('appointment-id-field').value;
            const appointmentData = {
                id: id || 'apt-' + Date.now(),
                patientId: document.getElementById('appointment-patient').value,
                doctorId: document.getElementById('appointment-doctor').value,
                date: document.getElementById('appointment-date').value,
                status: document.getElementById('appointment-status').value,
                purpose: document.getElementById('appointment-purpose').value
            };

            if (id) {
                const index = this.appointments.findIndex(a => a.id === id);
                this.appointments[index] = appointmentData;
            } else {
                this.appointments.push(appointmentData);
            }
            this.saveState('appointments');
            closeModal('appointmentModal');
        });

        document.getElementById('billing-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const docId = document.getElementById('bill-doctor').value;
            const doctorObj = this.doctors.find(d => d.id === docId);
            
            const selectedServices = Array.from(document.querySelectorAll('input[name="billing-services"]:checked'))
                .map(cb => cb.value);

            let amount = doctorObj ? doctorObj.consultation : 0;
            selectedServices.forEach(srvId => {
                const srv = defaultServices.find(s => s.id === srvId);
                if (srv) amount += srv.cost;
            });

            const newInvoice = {
                id: 'inv-' + (1000 + this.bills.length + 1),
                patientId: document.getElementById('bill-patient').value,
                doctorId: docId,
                date: new Date().toISOString().split('T')[0],
                services: selectedServices,
                amount: amount,
                status: 'pending'
            };

            this.bills.push(newInvoice);
            this.saveState('bills');
            closeModal('billingModal');
            this.viewInvoice(newInvoice.id);
        });

        // Billing modal dynamic calculation triggers
        document.getElementById('bill-doctor').addEventListener('change', () => this.updateBillingTotal());
        
        // Print and Mark Paid buttons on invoice view modal
        document.getElementById('btn-print-invoice').addEventListener('click', () => {
            window.print();
        });
    }

    switchTab(tabId) {
        document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === tabId) {
                item.classList.add('active');
            }
        });

        document.querySelectorAll('.workspace .view-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        const activePanel = document.getElementById(tabId);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        // Set header title
        const formattedTitle = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        document.getElementById('page-title').textContent = formattedTitle;
    }

    renderAll() {
        this.renderDashboard();
        this.renderPatients();
        this.renderDoctors();
        this.renderAppointments();
        this.renderBilling();
    }

    renderDashboard() {
        // Update stats
        document.getElementById('stat-total-patients').textContent = this.patients.length;
        document.getElementById('stat-active-doctors').textContent = this.doctors.length;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const todayApts = this.appointments.filter(a => a.date.startsWith(todayStr));
        document.getElementById('stat-appointments-today').textContent = todayApts.length;

        const totalRevenue = this.bills
            .filter(b => b.status === 'paid')
            .reduce((sum, b) => sum + b.amount, 0);
        document.getElementById('stat-revenue').textContent = `$${totalRevenue.toLocaleString()}`;

        // Populate Today's Schedule on Dashboard
        const list = document.getElementById('dashboard-schedule-list');
        list.innerHTML = '';
        if (todayApts.length === 0) {
            list.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No appointments booked for today.</td></tr>`;
            return;
        }

        todayApts.forEach(apt => {
            const patient = this.patients.find(p => p.id === apt.patientId);
            const doctor = this.doctors.find(d => d.id === apt.doctorId);
            const time = apt.date.split('T')[1];

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${time}</strong></td>
                <td>${patient ? patient.name : 'Unknown'}</td>
                <td>${doctor ? doctor.name : 'Unknown'}</td>
            `;
            list.appendChild(row);
        });
    }

    renderPatients(query = '') {
        const tbody = document.getElementById('patients-table-body');
        tbody.innerHTML = '';

        const filtered = this.patients.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.id.toLowerCase().includes(query.toLowerCase()) || 
            p.phone.includes(query)
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No patients found.</td></tr>`;
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${p.id.substring(4) || p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.age} / ${p.gender}</td>
                <td>${p.phone}</td>
                <td><span style="font-size: 0.8rem; display: inline-block; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.history || 'No history recorded'}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.editPatient('${p.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deletePatient('${p.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    editPatient(id) {
        const patient = this.patients.find(p => p.id === id);
        if (!patient) return;

        document.getElementById('patient-id-field').value = patient.id;
        document.getElementById('patient-name').value = patient.name;
        document.getElementById('patient-age').value = patient.age;
        document.getElementById('patient-gender').value = patient.gender;
        document.getElementById('patient-phone').value = patient.phone;
        document.getElementById('patient-history').value = patient.history || '';
        document.getElementById('patient-modal-title').textContent = 'Edit Patient Details';

        openModal('patientModal');
    }

    deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient record?')) {
            this.patients = this.patients.filter(p => p.id !== id);
            this.appointments = this.appointments.filter(a => a.patientId !== id);
            this.saveState('patients');
            this.saveState('appointments');
        }
    }

    renderDoctors(query = '') {
        const grid = document.getElementById('doctors-cards-container');
        grid.innerHTML = '';

        const filtered = this.doctors.filter(d => 
            d.name.toLowerCase().includes(query.toLowerCase()) || 
            d.specialty.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No doctors found matching filters.</div>`;
            return;
        }

        filtered.forEach(d => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            
            // Initial names for display
            const initials = d.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('');

            card.innerHTML = `
                <div class="doctor-avatar">${initials}</div>
                <div class="doctor-name">${d.name}</div>
                <div class="doctor-spec">${d.specialty}</div>
                
                <div class="doctor-details">
                    <div class="doctor-detail-item">
                        <span>Consult Fee:</span>
                        <span>$${d.consultation}</span>
                    </div>
                    <div class="doctor-detail-item">
                        <span>Phone:</span>
                        <span>${d.phone}</span>
                    </div>
                    <div class="doctor-detail-item">
                        <span>Schedule:</span>
                        <span style="font-size: 0.8rem; text-align: right;">${d.schedule}</span>
                    </div>
                </div>
                
                <div class="doctor-actions">
                    <button class="btn btn-secondary btn-sm" onclick="app.editDoctor('${d.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteDoctor('${d.id}')">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    editDoctor(id) {
        const doctor = this.doctors.find(d => d.id === id);
        if (!doctor) return;

        document.getElementById('doctor-id-field').value = doctor.id;
        document.getElementById('doctor-name').value = doctor.name;
        document.getElementById('doctor-specialty').value = doctor.specialty;
        document.getElementById('doctor-phone').value = doctor.phone;
        document.getElementById('doctor-consultation').value = doctor.consultation;
        document.getElementById('doctor-schedule').value = doctor.schedule;
        document.getElementById('doctor-modal-title').textContent = 'Edit Doctor Details';

        openModal('doctorModal');
    }

    deleteDoctor(id) {
        if (confirm('Are you sure you want to remove this doctor?')) {
            this.doctors = this.doctors.filter(d => d.id !== id);
            this.appointments = this.appointments.filter(a => a.doctorId !== id);
            this.saveState('doctors');
            this.saveState('appointments');
        }
    }

    populateSelectsForAppointment() {
        const patientSel = document.getElementById('appointment-patient');
        const doctorSel = document.getElementById('appointment-doctor');

        patientSel.innerHTML = '<option value="" disabled selected>Select Patient</option>';
        this.patients.forEach(p => {
            patientSel.innerHTML += `<option value="${p.id}">${p.name} (ID: ${p.id.substring(4) || p.id})</option>`;
        });

        doctorSel.innerHTML = '<option value="" disabled selected>Select Doctor</option>';
        this.doctors.forEach(d => {
            doctorSel.innerHTML += `<option value="${d.id}">${d.name} (${d.specialty})</option>`;
        });
    }

    renderAppointments(query = '') {
        const tbody = document.getElementById('appointments-table-body');
        tbody.innerHTML = '';

        const filtered = this.appointments.filter(a => {
            const patient = this.patients.find(p => p.id === a.patientId);
            const doctor = this.doctors.find(d => d.id === a.doctorId);
            const patName = patient ? patient.name.toLowerCase() : '';
            const docName = doctor ? doctor.name.toLowerCase() : '';
            return patName.includes(query.toLowerCase()) || docName.includes(query.toLowerCase());
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No appointments booked.</td></tr>`;
            return;
        }

        // Sort by date descending
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        filtered.forEach(a => {
            const patient = this.patients.find(p => p.id === a.patientId);
            const doctor = this.doctors.find(d => d.id === a.doctorId);

            const formatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = new Date(a.date).toLocaleDateString('en-US', formatOptions);

            let badgeClass = 'badge-primary';
            if (a.status === 'completed') badgeClass = 'badge-success';
            if (a.status === 'cancelled') badgeClass = 'badge-danger';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${formattedDate}</strong></td>
                <td>${patient ? patient.name : 'Deleted Patient'}</td>
                <td>${doctor ? doctor.name : 'Deleted Doctor'}</td>
                <td>${a.purpose}</td>
                <td><span class="badge ${badgeClass}">${a.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.editAppointment('${a.id}')">Reschedule</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteAppointment('${a.id}')">Cancel</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    editAppointment(id) {
        const apt = this.appointments.find(a => a.id === id);
        if (!apt) return;

        this.populateSelectsForAppointment();

        document.getElementById('appointment-id-field').value = apt.id;
        document.getElementById('appointment-patient').value = apt.patientId;
        document.getElementById('appointment-doctor').value = apt.doctorId;
        document.getElementById('appointment-date').value = apt.date;
        document.getElementById('appointment-status').value = apt.status;
        document.getElementById('appointment-purpose').value = apt.purpose;
        document.getElementById('appointment-modal-title').textContent = 'Reschedule Appointment';

        openModal('appointmentModal');
    }

    deleteAppointment(id) {
        if (confirm('Cancel this scheduled appointment?')) {
            const index = this.appointments.findIndex(a => a.id === id);
            if (index !== -1) {
                this.appointments[index].status = 'cancelled';
                this.saveState('appointments');
            }
        }
    }

    populateSelectsForBilling() {
        const patSel = document.getElementById('bill-patient');
        const docSel = document.getElementById('bill-doctor');

        patSel.innerHTML = '<option value="" disabled selected>Select Patient</option>';
        this.patients.forEach(p => {
            patSel.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });

        docSel.innerHTML = '<option value="" disabled selected>Select Physician</option>';
        this.doctors.forEach(d => {
            docSel.innerHTML += `<option value="${d.id}">${d.name} ($${d.consultation})</option>`;
        });

        // Add additional services check list
        const srvContainer = document.getElementById('additional-services-list');
        srvContainer.innerHTML = '';
        defaultServices.forEach(srv => {
            srvContainer.innerHTML += `
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 0.85rem;">
                    <input type="checkbox" name="billing-services" value="${srv.id}" onchange="app.updateBillingTotal()">
                    ${srv.name} (+$${srv.cost})
                </label>
            `;
        });
    }

    updateBillingTotal() {
        const docId = document.getElementById('bill-doctor').value;
        const doctorObj = this.doctors.find(d => d.id === docId);
        const consultFee = doctorObj ? doctorObj.consultation : 0;

        let extraFee = 0;
        document.querySelectorAll('input[name="billing-services"]:checked').forEach(cb => {
            const srv = defaultServices.find(s => s.id === cb.value);
            if (srv) extraFee += srv.cost;
        });

        document.getElementById('summary-consultation').textContent = `$${consultFee.toFixed(2)}`;
        document.getElementById('summary-procedures').textContent = `$${extraFee.toFixed(2)}`;
        document.getElementById('summary-total').textContent = `$${(consultFee + extraFee).toFixed(2)}`;
    }

    renderBilling(query = '') {
        const tbody = document.getElementById('billing-table-body');
        tbody.innerHTML = '';

        const filtered = this.bills.filter(b => {
            const patient = this.patients.find(p => p.id === b.patientId);
            const patName = patient ? patient.name.toLowerCase() : '';
            return patName.includes(query.toLowerCase()) || b.id.toLowerCase().includes(query.toLowerCase());
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No invoices found.</td></tr>`;
            return;
        }

        filtered.forEach(b => {
            const patient = this.patients.find(p => p.id === b.patientId);
            let badgeClass = b.status === 'paid' ? 'badge-success' : 'badge-warning';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${b.id.substring(4) || b.id}</strong></td>
                <td>${patient ? patient.name : 'Unknown Patient'}</td>
                <td>${b.date}</td>
                <td><strong>$${b.amount}</strong></td>
                <td><span class="badge ${badgeClass}">${b.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="app.viewInvoice('${b.id}')">View Details</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    viewInvoice(id) {
        const bill = this.bills.find(b => b.id === id);
        if (!bill) return;

        const patient = this.patients.find(p => p.id === bill.patientId);
        const doctor = this.doctors.find(d => d.id === bill.doctorId);

        const content = document.getElementById('invoice-details-content');
        
        let servicesRows = `
            <tr>
                <td>Consultation Fee (${doctor ? doctor.name : 'Physician'})</td>
                <td>$${doctor ? doctor.consultation.toFixed(2) : '0.00'}</td>
            </tr>
        `;

        bill.services.forEach(srvId => {
            const srv = defaultServices.find(s => s.id === srvId);
            if (srv) {
                servicesRows += `
                    <tr>
                        <td>${srv.name}</td>
                        <td>$${srv.cost.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        content.innerHTML = `
            <div class="invoice-container">
                <div class="invoice-header">
                    <div>
                        <h2>MEDPULSE CLINIC</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">100 Healthcare Pkwy, Suite 400<br>Medical District, CA 90210</p>
                    </div>
                    <div class="invoice-meta">
                        <h3>INVOICE</h3>
                        <p style="font-weight: 600; color: var(--primary);">#${bill.id}</p>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Date: ${bill.date}</p>
                    </div>
                </div>
                
                <div class="invoice-parties">
                    <div>
                        <strong style="color: var(--text-secondary);">Billed To:</strong>
                        <p style="font-weight: 600; margin-top: 4px;">${patient ? patient.name : 'N/A'}</p>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Phone: ${patient ? patient.phone : 'N/A'}</p>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Age/Gender: ${patient ? patient.age : 'N/A'} / ${patient ? patient.gender : 'N/A'}</p>
                    </div>
                    <div style="text-align: right;">
                        <strong style="color: var(--text-secondary);">Billing Status:</strong>
                        <p style="margin-top: 4px;"><span class="badge ${bill.status === 'paid' ? 'badge-success' : 'badge-warning'}">${bill.status.toUpperCase()}</span></p>
                    </div>
                </div>
                
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicesRows}
                    </tbody>
                </table>
                
                <div class="invoice-total-section">
                    <div style="display: flex; justify-content: space-between; width: 220px; font-size: 0.9rem;">
                        <span>Subtotal:</span>
                        <span>$${bill.amount.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 220px; font-weight: 700; font-size: 1.2rem; border-top: 2px solid var(--border-color); padding-top: 8px; margin-top: 8px; color: var(--primary);">
                        <span>Total Due:</span>
                        <span>$${bill.amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        // Update Mark as Paid state and visibility
        const markPaidBtn = document.getElementById('btn-mark-paid');
        if (bill.status === 'paid') {
            markPaidBtn.style.display = 'none';
        } else {
            markPaidBtn.style.display = 'inline-block';
            markPaidBtn.onclick = () => {
                bill.status = 'paid';
                this.saveState('bills');
                this.viewInvoice(bill.id); // re-render
            };
        }

        openModal('invoiceViewModal');
    }
}

// Global modal helpers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize application on load
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new HMSApp();
});
