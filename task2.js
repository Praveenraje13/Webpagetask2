// ============================================================
//  CampusIntern Portal — task2.js
//  Handles: Form Validation · Application Checklist · Portfolio Gallery
// ============================================================

// ── DOM references ──────────────────────────────────────────
const form        = document.getElementById('registrationForm');
const nameEl      = document.getElementById('applicant-name');
const emailEl     = document.getElementById('applicant-email');
const phoneEl     = document.getElementById('applicant-phone');
const collegeEl   = document.getElementById('applicant-college');
const deptEl      = document.getElementById('applicant-dept');
const roleEl      = document.getElementById('preferred-role');
const messageEl   = document.getElementById('application-message');
const resumeEl    = document.getElementById('resume');
const successBox  = document.getElementById('successBox');
const progressFill = document.getElementById('progressFill');


// ── Utility helpers ─────────────────────────────────────────
function showError(elId, show, msg) {
  const el = document.getElementById(elId);
  if (show) {
    el.style.display = 'block';
    if (msg) el.textContent = msg;
  } else {
    el.style.display = 'none';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  if (!phone) return true; // optional field
  return /^[0-9+()\-\s]{7,20}$/.test(phone);
}

function validateResume(fileInput) {
  const files = fileInput.files;
  if (!files || files.length === 0) return false;
  const f = files[0];
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const name = f.name.toLowerCase();
  return allowed.includes(f.type) || name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx');
}


// ── Progress bar ─────────────────────────────────────────────
function updateProgress() {
  const fields = [
    nameEl.value.trim().length >= 2,
    validateEmail(emailEl.value.trim()),
    collegeEl.value.trim().length >= 2,
    deptEl.value.trim().length >= 1,
    roleEl.value !== '',
    validateResume(resumeEl),
    messageEl.value.trim().length >= 10
  ];

  const completed = fields.filter(Boolean).length;
  const total = fields.length;
  const percentage = (completed / total) * 100;

  progressFill.style.width = percentage + '%';
  document.getElementById('fieldsCompleted').textContent = `${completed}/${total}`;

  return completed === total;
}


// ── Form validation ──────────────────────────────────────────
function validateApplicationForm() {
  let ok = true;
  successBox.style.display = 'none';

  // Name
  const name = nameEl.value.trim();
  if (name.length < 2) {
    showError('err-name', true, 'Please enter your name (2+ characters).');
    nameEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-name', false);
    nameEl.classList.remove('invalid');
  }

  // Email
  const email = emailEl.value.trim();
  if (!validateEmail(email)) {
    showError('err-email', true, 'Please enter a valid email address.');
    emailEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-email', false);
    emailEl.classList.remove('invalid');
  }

  // Phone (optional)
  const phone = phoneEl.value.trim();
  if (phone && !validatePhone(phone)) {
    showError('err-phone', true, 'Enter a valid phone number.');
    phoneEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-phone', false);
    phoneEl.classList.remove('invalid');
  }

  // College
  const college = collegeEl.value.trim();
  if (college.length < 2) {
    showError('err-college', true, 'Please enter your college name.');
    collegeEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-college', false);
    collegeEl.classList.remove('invalid');
  }

  // Department
  const dept = deptEl.value.trim();
  if (dept.length < 1) {
    showError('err-dept', true, 'Please enter your department.');
    deptEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-dept', false);
    deptEl.classList.remove('invalid');
  }

  // Role
  if (!roleEl.value) {
    showError('err-role', true, 'Please choose a preferred role.');
    roleEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-role', false);
    roleEl.classList.remove('invalid');
  }

  // Message
  const msg = messageEl.value.trim();
  if (msg.length < 10) {
    showError('err-message', true, 'Message must be at least 10 characters.');
    messageEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-message', false);
    messageEl.classList.remove('invalid');
  }

  // Resume
  if (!validateResume(resumeEl)) {
    showError('err-resume', true, 'Please upload your resume (PDF or DOC).');
    resumeEl.classList.add('invalid');
    ok = false;
  } else {
    showError('err-resume', false);
    resumeEl.classList.remove('invalid');
  }

  updateProgress();

  if (ok) {
    successBox.style.display = 'block';
  }

  return ok;
}

// Submit
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (validateApplicationForm()) {
    alert('Application validated successfully! (Demo: no server submission)');
    form.reset();
    successBox.style.display = 'none';
    updateProgress();
  } else {
    const firstErr = document.querySelector('.error[style*="display: block"]');
    if (firstErr) {
      const fieldId = firstErr.id.replace('err-', 'applicant-');
      const field = document.getElementById(fieldId) ||
                    document.getElementById(firstErr.id.replace('err-', '').replace('applicant-', ''));
      if (field) field.focus();
    }
  }
});

// Reset
document.getElementById('resetFormBtn').addEventListener('click', () => {
  form.reset();
  document.querySelectorAll('.error').forEach(x => x.style.display = 'none');
  document.querySelectorAll('.invalid').forEach(x => x.classList.remove('invalid'));
  successBox.style.display = 'none';
  updateProgress();
});

// Live validation on input/change
[nameEl, emailEl, phoneEl, collegeEl, deptEl, messageEl, roleEl, resumeEl].forEach(inp => {
  inp.addEventListener('input',  () => validateApplicationForm());
  inp.addEventListener('change', () => validateApplicationForm());
});


// ── Application Checklist ────────────────────────────────────
const todoInput  = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList   = document.getElementById('todoList');

function updateChecklistCount() {
  document.getElementById('checklistCount').textContent = todoList.children.length;
}

function createTodoItem(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type  = 'checkbox';
  checkbox.title = 'Mark done';

  const span = document.createElement('div');
  span.className   = 'task-text';
  span.textContent = text;

  checkbox.addEventListener('change', () => {
    span.classList.toggle('task-done', checkbox.checked);
  });

  const del = document.createElement('button');
  del.className   = 'btn small danger';
  del.textContent = 'Delete';
  del.addEventListener('click', () => {
    li.remove();
    updateChecklistCount();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  return li;
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todoList.prepend(createTodoItem(text));
  todoInput.value = '';
  todoInput.focus();
  updateChecklistCount();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

// Pre-fill default checklist items
['Attach resume (PDF)', 'Add portfolio link', 'Write short intro message'].forEach(t => {
  todoList.appendChild(createTodoItem(t));
});
updateChecklistCount();


// ── Portfolio / Image Gallery ────────────────────────────────
const galleryGrid  = document.getElementById('galleryGrid');
const imgUrlInput  = document.getElementById('imgUrlInput');
const addUrlImgBtn = document.getElementById('addUrlImgBtn');
const imgFileInput = document.getElementById('imgFileInput');
const addFileImgBtn = document.getElementById('addFileImgBtn');

function updateGalleryCount() {
  document.getElementById('galleryCount').textContent = galleryGrid.children.length;
}

function createGalleryItem(imgSrc) {
  const div = document.createElement('div');
  div.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = 'Portfolio image';
  img.onerror = function () {
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
  };

  const removeBtn = document.createElement('button');
  removeBtn.className   = 'remove';
  removeBtn.textContent = '×';
  removeBtn.title       = 'Remove image';
  removeBtn.addEventListener('click', () => {
    div.remove();
    updateGalleryCount();
  });

  div.appendChild(img);
  div.appendChild(removeBtn);
  return div;
}

addUrlImgBtn.addEventListener('click', () => {
  const url = imgUrlInput.value.trim();
  if (!url) return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert('Please enter a valid URL starting with http:// or https://');
    return;
  }
  galleryGrid.appendChild(createGalleryItem(url));
  imgUrlInput.value = '';
  updateGalleryCount();
});

imgUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); addUrlImgBtn.click(); }
});

addFileImgBtn.addEventListener('click', () => {
  const files = imgFileInput.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    galleryGrid.appendChild(createGalleryItem(e.target.result));
    imgFileInput.value = '';
    updateGalleryCount();
  };
  reader.readAsDataURL(file);
});

// Initialise progress bar on page load
updateProgress();
