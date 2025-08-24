document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('progressBar');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const summaryInput = document.getElementById('summary');
  const addEducationBtn = document.getElementById('add-education');
  const educationContainer = document.getElementById('education-container');
  const addExperienceBtn = document.getElementById('add-experience');
  const experienceContainer = document.getElementById('experience-container');
  const skillTags = document.querySelectorAll('.skill-tag');
  const resetFormBtn = document.getElementById('reset-form');
  const downloadPdfBtn = document.getElementById('download-pdf');

  const customSkillInput = document.getElementById('custom-skill');
  const addCustomSkillBtn = document.getElementById('add-custom-skill');
  const skillsContainer = document.querySelector('.skills-container');

  const previewName = document.getElementById('preview-name');
  const previewEmail = document.getElementById('preview-email');
  const previewPhone = document.getElementById('preview-phone');
  const previewSummary = document.getElementById('preview-summary');
  const previewEducation = document.getElementById('preview-education');
  const previewExperience = document.getElementById('preview-experience');
  const previewSkills = document.getElementById('preview-skills');

  let selectedSkills = [];

  // Bind inputs => preview
  [nameInput, emailInput, phoneInput, summaryInput].forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  // Helpers
  function createEducationItem() {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-group"><label>Degree</label><input type="text" class="education-degree"></div>
      <div class="form-group"><label>Institution</label><input type="text" class="education-institution"></div>
      <div class="form-group"><label>Year</label><input type="text" class="education-year"></div>
      <button type="button" class="remove-btn secondary">Remove</button>
    `;
    div.querySelectorAll('input').forEach(inp => inp.addEventListener('input', updatePreview));
    div.querySelector('.remove-btn').addEventListener('click', () => { div.remove(); updatePreview(); });
    return div;
  }
  function createExperienceItem() {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="form-group"><label>Job Title</label><input type="text" class="experience-title"></div>
      <div class="form-group"><label>Company</label><input type="text" class="experience-company"></div>
      <div class="form-group"><label>Duration</label><input type="text" class="experience-duration"></div>
      <div class="form-group"><label>Description</label><textarea class="experience-description"></textarea></div>
      <button type="button" class="remove-btn secondary">Remove</button>
    `;
    div.querySelectorAll('input, textarea').forEach(inp => inp.addEventListener('input', updatePreview));
    div.querySelector('.remove-btn').addEventListener('click', () => { div.remove(); updatePreview(); });
    return div;
  }

  // Add new blocks
  addEducationBtn.addEventListener('click', () => { educationContainer.appendChild(createEducationItem()); updatePreview(); });
  addExperienceBtn.addEventListener('click', () => { experienceContainer.appendChild(createExperienceItem()); updatePreview(); });

  // Skill selection
  skillTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const skill = this.dataset.skill;
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selectedSkills = selectedSkills.filter(s => s !== skill);
      } else {
        this.classList.add('selected');
        selectedSkills.push(skill);
      }
      updatePreview();
    });
  });

  // Add custom skill
  addCustomSkillBtn.addEventListener('click', () => {
    const skill = customSkillInput.value.trim();
    if (!skill) return;

    if (selectedSkills.includes(skill)) {
      alert('Skill already selected.');
      return;
    }

    const newTag = document.createElement('div');
    newTag.className = 'skill-tag selected';
    newTag.setAttribute('data-skill', skill);
    newTag.textContent = skill;

    newTag.addEventListener('click', function () {
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selectedSkills = selectedSkills.filter(s => s !== skill);
      } else {
        this.classList.add('selected');
        selectedSkills.push(skill);
      }
      updatePreview();
    });

    skillsContainer.appendChild(newTag);
    selectedSkills.push(skill);
    updatePreview();
    customSkillInput.value = '';
  });

  // Reset form
  resetFormBtn.addEventListener('click', () => {
    if (!confirm('Reset the form?')) return;
    document.querySelectorAll('input, textarea').forEach(el => el.value = '');
    selectedSkills = [];
    skillTags.forEach(tag => tag.classList.remove('selected'));
    educationContainer.innerHTML = '';
    experienceContainer.innerHTML = '';
    educationContainer.appendChild(createEducationItem());
    experienceContainer.appendChild(createExperienceItem());
    updatePreview();
  });

  // Download PDF
  downloadPdfBtn.addEventListener('click', () => {
    const resumeElement = document.getElementById('resume-preview');

    const opt = {
      margin: 10,
      filename: 'my-resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
      html2pdf().set(opt).from(resumeElement).save();
    }, 100);
  });

  // Update preview content
  function updatePreview() {
    previewName.textContent = nameInput.value || 'Your Name';
    previewEmail.textContent = emailInput.value || 'email@example.com';
    previewPhone.textContent = phoneInput.value || '(123) 456-7890';
    previewSummary.textContent = summaryInput.value || 'Your professional summary will appear here.';

    previewEducation.innerHTML = '';
    educationContainer.querySelectorAll('.dynamic-item').forEach(item => {
      const degree = item.querySelector('.education-degree').value;
      const inst = item.querySelector('.education-institution').value;
      const year = item.querySelector('.education-year').value;
      if (degree || inst || year) {
        previewEducation.innerHTML += `<div class="education-item"><h4>${degree}</h4><div class="date">${inst} | ${year}</div></div>`;
      }
    });
    if (previewEducation.innerHTML === '') previewEducation.innerHTML = '<p>Your education history will appear here.</p>';
    // Add input listeners to existing education inputs
    educationContainer.querySelectorAll('.dynamic-item input').forEach(input => {
    input.addEventListener('input', updatePreview);
    });
    experienceContainer.querySelectorAll('.dynamic-item input, .dynamic-item textarea').forEach(input => {
    input.addEventListener('input', updatePreview);
    });


    previewExperience.innerHTML = '';
    experienceContainer.querySelectorAll('.dynamic-item').forEach(item => {
      const title = item.querySelector('.experience-title').value;
      const comp = item.querySelector('.experience-company').value;
      const dur = item.querySelector('.experience-duration').value;
      const desc = item.querySelector('.experience-description').value;
      if (title || comp || dur || desc) {
        previewExperience.innerHTML += `<div class="experience-item"><h4>${title}</h4><div class="date">${comp} | ${dur}</div><p>${desc}</p></div>`;
      }
    });
    if (previewExperience.innerHTML === '') previewExperience.innerHTML = '<p>Your work experience will appear here.</p>';

    previewSkills.innerHTML = '';
    if (selectedSkills.length > 0) {
      selectedSkills.forEach(skill => previewSkills.innerHTML += `<span>${skill}</span>`);
    } else {
      previewSkills.innerHTML = '<p>Your skills will appear here.</p>';
    }

    updateProgressBar();
  }

  // Progress bar
  function updateProgressBar() {
    let filled = 0, total = 0;
    [nameInput, emailInput, phoneInput, summaryInput].forEach(i => { total++; if (i.value.trim()) filled++; });
    educationContainer.querySelectorAll('input').forEach(i => { total++; if (i.value.trim()) filled++; });
    experienceContainer.querySelectorAll('input, textarea').forEach(i => { total++; if (i.value.trim()) filled++; });
    total++; if (selectedSkills.length > 0) filled++;
    let percentage = Math.max(5, Math.floor((filled / total) * 100));
    progressBar.style.width = `${percentage}%`;
  }

  // Initialize
  updatePreview();
});
