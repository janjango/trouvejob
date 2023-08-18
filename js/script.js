// Déclarez une variable pour le port du backend
const backendPort = 3000;
const serverUrl = "https://linkedin-server-g5kx.onrender.com";

// Function to perform the job search based on user input
function searchJobs() {
  const keyword = document.getElementById('keywordInput').value.trim();
  const location = document.getElementById('locationInput').value.trim();
  const jobType = document.getElementById('jobTypeSelect').value;
  //const salary = document.getElementById('salaryInput').value.trim();

  const queryOptions = {
    keyword: keyword,
    location: location,
    jobType: jobType,
    //salary: salary,
    limit: '10'
  };
  fetch(`${serverUrl}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryOptions),
  })
  .then(response => response.json())
  .then(jobs => {
    displayJobs(jobs);
  })
  .catch(error => {
    console.error('Error fetching job listings:', error);
  });
}

let displayedJobsCount = 0;

function displayJobs(jobs) {
  const jobListElement = document.getElementById("jobList");
  const jobCountElement = document.getElementById("jobCount");
  jobListElement.innerHTML = ""; // Clear the previous content

  jobs.forEach((job) => {
    const jobItem = `
      <div class="job-item p-4 mb-4">
        <div class="row g-4">
          <div class="col-sm-12 col-md-8 d-flex align-items-center">
            <img class="flex-shrink-0 img-fluid border rounded" src="img/LI-In-Bug.png" alt="${job.company}" style="width: 80px; height: 80px;">
            <div class="text-start ps-4">
              <h5 class="mb-3">${job.position}</h5>
              <span class="text-truncate me-3"><i class="fa fa-building-o text-primary me-2"></i>${job.company}</span>
              <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}</span>
              <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
            </div>
          </div>

          <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
            <div class="d-flex mb-3">
                <a class="btn btn-light btn-square me-3" href=""><i class="far fa-heart text-primary"></i></a>
                <a class="btn btn-primary" href="${job.jobUrl}" target="_blank">Postuler</a>
            </div>
            <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Date Publication: ${formatDate(job.date)}</small>
          </div>       

        </div>
      </div>
    `;

    jobListElement.insertAdjacentHTML("beforeend", jobItem);
 
    // Mettre à jour le nombre d'emplois trouvés
    jobCountElement.textContent = `${jobs.length} jobs trouvés`;
    // Vérifie si le bouton "Voir plus" doit être affiché ou masqué
    if (displayedJobsCount >= jobs.length) {
      document.getElementById('showMoreBtn').style.display = 'none';
    } else {
      document.getElementById('showMoreBtn').style.display = 'block';
    }
  });
}



function loadDefaultJobs() {
  // Obtenir les coordonnées géographiques de l'utilisateur
  navigator.geolocation.getCurrentPosition(
      position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Appel de la fonction de recherche avec les options par défaut incluant les coordonnées géographiques
          const defaultQueryOptions = {
              keyword: 'software engineer', // Le mot-clé par défaut
              jobType: 'full time', // Le type de poste par défaut
              location: `${latitude},${longitude}`, // Les coordonnées géographiques
          };

          searchJobs(defaultQueryOptions);
      },
      error => {
          console.error('Erreur de géolocalisation :', error);
      }
  );
}


function formatDate(dateString) {
  const jobDate = new Date(dateString);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const day = jobDate.getDate();
  const month = monthNames[jobDate.getMonth()];
  const year = jobDate.getFullYear();
  return `${day} ${month}, ${year}`;
}

// Fonction pour charger plus d'offres d'emploi lorsqu'on clique sur "Voir plus"
function loadMoreJobs() {
  const moreJobs = jobData.slice(displayedJobsCount, displayedJobsCount + 10);
  displayJobs(moreJobs);
}

// Ajouter un gestionnaire d'événement pour le bouton "Voir plus"
document.getElementById('showMoreBtn').addEventListener('click', loadMoreJobs);

// Fonction pour afficher davantage d'offres d'emploi
function showMoreJobs() {
  const moreJobs = jobs.slice(displayedJobsCount, displayedJobsCount + jobsPerPage);
  displayedJobsCount += moreJobs.length;

  // Crée une chaîne HTML contenant les offres d'emploi supplémentaires
  const moreJobsHTML = createJobsHTML(moreJobs);

  // Ajoute les offres d'emploi supplémentaires à la liste existante
  const jobListContainer = document.getElementById('jobList');
  jobListContainer.innerHTML += moreJobsHTML;

  // Vérifie si toutes les offres d'emploi ont été affichées
  if (displayedJobsCount >= jobs.length) {
      // Masquer le bouton "Voir plus" si toutes les offres sont affichées
      document.getElementById('showMoreBtn').style.display = 'none';
  }
}