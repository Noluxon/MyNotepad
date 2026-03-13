// Information des utilisateurs
var utilisateurArray = [];

// note des utilisateurs
var notesStockage = {};

// qui est connecté ?
var actuelUtilisateur = null;

// Navigation
function goTo(pageId) {
  var toutesPages = document.querySelectorAll('.page');
  for (var i = 0; i < toutesPages.length; i++) {
    toutesPages[i].classList.remove('active'); 
  }
  document.getElementById(pageId).classList.add('active');

  // Si le profil est sélectionné, faire apparaître les données
  if (pageId === 'page-profile' && actuelUtilisateur !== null) {
    document.getElementById('prof-pseudo').innerText  = actuelUtilisateur.pseudo;    
    document.getElementById('prof-courriel').innerText = actuelUtilisateur.courriel; 
    document.getElementById('prof-date').innerText    = actuelUtilisateur.creea;     
    document.getElementById('prof-notes').innerText   = notesStockage[actuelUtilisateur.pseudo].length; 
  }
}

// Fonction de connexion
function doLogin() {
  var utilisateurEcrit = document.getElementById('connexion-user').value;
  var motdepasseEcrit  = document.getElementById('connexion-pass').value;

  document.getElementById('erreurconnexion').style.display = 'none';

  if (utilisateurEcrit === '' || motdepasseEcrit === '') {
    document.getElementById('erreurconnexion').innerText = 'Remplissez tous les champs !';
    document.getElementById('erreurconnexion').style.display = 'block';
    return;
  }

  var utilisateurTrouve = null;
  for (var i = 0; i < utilisateurArray.length; i++) {
    if (utilisateurArray[i].pseudo === utilisateurEcrit && utilisateurArray[i].motdepasse === motdepasseEcrit) {
      utilisateurTrouve = utilisateurArray[i];
      break;
    }
  }

  if (utilisateurTrouve === null) {
    document.getElementById('erreurconnexion').innerText = 'Pseudo ou mot de passe introuvable !';
    document.getElementById('erreurconnexion').style.display = 'block';
  } else {
    actuelUtilisateur = utilisateurTrouve;
    document.getElementById('connexion-user').value = '';
    document.getElementById('connexion-pass').value = '';
    loadDashboard();
    goTo('page-tdb');
  }
}

// Fonction d'inscription
function doRegister() {
  var userNouveau  = document.getElementById('inscuser').value.trim();
  var newCourriel  = document.getElementById('insc-courriel').value.trim();
  var nouveauPass  = document.getElementById('insc-pass').value;
  var passConf     = document.getElementById('insc-pass2').value;

  var errEl = document.getElementById('insc-erreur');
  var sucEl = document.getElementById('insc-success');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  // Vérification de base
  if (userNouveau === '' || newCourriel === '' || nouveauPass === '') {
    errEl.innerText = 'Remplissez tous les champs !';
    errEl.style.display = 'block';
    return;
  }

  if (nouveauPass !== passConf) {
    errEl.innerText = 'Les mots de passe ne correspondent pas !';
    errEl.style.display = 'block';
    return; 
  }

  if (nouveauPass.length < 6) {
    errEl.innerText = 'Votre mot de passe doit être composé de plus de 6 caractères';
    errEl.style.display = 'block';
    return; 
  }

  // Vérifier si le pseudo est déjà pris
  for (var i = 0; i < utilisateurArray.length; i++) {
    if (utilisateurArray[i].pseudo === userNouveau) {
      errEl.innerText = 'Ce pseudo est déjà pris !';
      errEl.style.display = 'block';         
      return;
    }
  }

  // Placer le nouvel utilisateur dans le tableau
  var userNouveauObj = {
    pseudo:    userNouveau,  
    courriel:  newCourriel,   
    motdepasse: nouveauPass,  
    creea:     new Date().toLocaleDateString()
  };

  utilisateurArray.push(userNouveauObj);
  notesStockage[userNouveau] = [];

  sucEl.style.display = 'block';

  // Clear le formulaire
  document.getElementById('inscuser').value = '';         
  document.getElementById('insc-courriel').value = '';
  document.getElementById('insc-pass').value = '';
  document.getElementById('insc-pass2').value = '';
} 

// Chargement du tableau de bord
function loadDashboard() {
  // Vérification
  if (!notesStockage[actuelUtilisateur.pseudo]) {
    notesStockage[actuelUtilisateur.pseudo] = [];
  }

  document.getElementById('dash-utilisateur').innerText = actuelUtilisateur.pseudo;
  renderNotes();
  showTab('tab-notes', document.querySelector('.nav-btn'));
}

function showTab(tabId, btn) {
  document.getElementById('tab-notes').style.display = 'none'; 
  document.getElementById('tab-ajouter').style.display = 'none';

  var navBtns = document.querySelectorAll('.nav-btn');
  for (var i = 0; i < navBtns.length; i++) {
    navBtns[i].classList.remove('active-tab');
  }

  document.getElementById(tabId).style.display = 'block';
  if (btn) btn.classList.add('active-tab');
}

// Fonction d'ajout de note
function addNote() {
  var titre  = document.getElementById('titre-note').value.trim();
  var corps  = document.getElementById('note-body').value.trim();
  var errEl  = document.getElementById('erreur-note');
  var sucEl  = document.getElementById('note-success');

  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (titre === '' || corps === '') { 
    errEl.style.display = 'block';
    return;
  }

  var nouveauNote = {
    id:    Date.now(),
    titre: titre,
    corps: corps, 
    date:  new Date().toLocaleString()
  };

  notesStockage[actuelUtilisateur.pseudo].push(nouveauNote); 

  document.getElementById('titre-note').value = '';
  document.getElementById('note-body').value  = '';

  sucEl.style.display = 'block';
  setTimeout(function() { sucEl.style.display = 'none'; }, 2000);

  renderNotes();
} 

function deleteNote(id) {
  var mesNotes = notesStockage[actuelUtilisateur.pseudo];
  for (var i = 0; i < mesNotes.length; i++) {
    if (mesNotes[i].id === Number(id)) {
      mesNotes.splice(i, 1);
      break;
    }
  }
  renderNotes();
}

// Affichage des notes
function renderNotes() {
  var listeEl  = document.getElementById('notes-liste');
  var compteEl = document.getElementById('compte-note');
  var mesNotes = notesStockage[actuelUtilisateur.pseudo]; 

  compteEl.innerText = mesNotes.length; 

  if (mesNotes.length === 0) {
    listeEl.innerHTML = '<div class="etat-vide"><span>📭</span>Pas encore de notes ! Ajoutez-en une ci-dessus.</div>'; 
    return;
  }



  

  var html = '';
  for (var i = 0; i < mesNotes.length; i++) {
    var n = mesNotes[i];
    html += '<div class="note-item">';
    html += '<div class="note-title">' + escapeHtml(n.titre) + '</div>';
    html += '<div class="note-body">'  + escapeHtml(n.corps)  + '</div>';
    html += '<div class="note-date">saved: ' + n.date + '</div>';
    html += '<button class="note-delete" onclick="deleteNote(' + n.id + ')">✕ delete</button>';
    html += '</div>';
  }

  listeEl.innerHTML = html; 
}

// Prévenir XSS
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;');
}

// Se déconnecter
function doLogout() {
  actuelUtilisateur = null; 
  goTo('page-connexion');   
}
