// CHARGEMENT DE LA LISTE AU DEMARRAGE
window.onload = function () {
  var listeSauvegardee = localStorage.getItem("maListe");
  if (listeSauvegardee) {
    list.innerHTML = listeSauvegardee;

    // Réattacher les événements sur les icônes restaurées
    list.querySelectorAll(".fa-trash").forEach(function (icon) {
      icon.addEventListener("click", function () {
        var li = icon.parentElement;
        li.classList.add("fade-out");
        li.addEventListener("animationend", function () {
          li.remove();
          sauvegarderListe();
        });
      });
    });

    list.querySelectorAll(".fa-edit").forEach(function (icon) {
      icon.addEventListener("click", function () {
        var li = icon.parentElement;
        var inputModif = document.createElement("input");
        inputModif.value = li.firstChild.textContent;
        li.textContent = "";
        li.appendChild(inputModif);

        inputModif.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            if (inputModif.value.trim() === "") {
              alert("Le champ ne peut pas être vide.");
              inputModif.focus();
              return;
            }
            li.textContent = inputModif.value;
            li.appendChild(icon.parentElement.querySelector(".fa-trash")); // Réattache "Supprimer"
            li.appendChild(icon.parentElement.querySelector(".fa-edit")); // Réattache "Modifier"
            sauvegarderListe();
          }
        });
      });
    });
  }
};

// CREATION DES VARIABLES NECESSAIRES
var textInput = document.getElementById("addText-field");
var boutonAjouter = document.getElementById("addElement-button");
var boutonSupp = document.getElementById("delElement-button");
var list = document.getElementById("list");

// EVENT
boutonAjouter.addEventListener("click", buttonClick);
boutonSupp.addEventListener("click", toutSupp);

// CREATION DE L'ITEM
function buttonClick(e) {
  e.preventDefault();

  // NEW ITEM VALUE
  var nouvelElement = textInput.value.trim(); // Supprime les espaces inutiles

  // PREVENTION ENTREE NULL
  if (nouvelElement === "") {
    alert("Veuillez saisir un texte avant d'ajouter.");
    return;
  }

  // CREATION LI & ICON ELEMENT
  var li = document.createElement("li");
  var suppBtn = document.createElement("i");
  var modifier = document.createElement("i");

  // AJOUT D'ICONE POUR REMPLACER LES TEXTES
  suppBtn.classList.add("fas", "fa-trash", "Supp-btn"); // Icône "poubelle"
  modifier.classList.add("fas", "fa-edit", "Modifier-btn"); // Icône "modifier"

  // AJOUT TEXT NODE
  li.appendChild(document.createTextNode(nouvelElement));

  // AJOUT CLASSE POUR CSS
  suppBtn.classList.add("Supp-btn");
  modifier.classList.add("Modifier-btn");
  suppBtn.setAttribute("aria-label", "Supprimer cet élément");
  modifier.setAttribute("aria-label", "Modifier cet élément");

  // AJOUT ANIMATION FADE-IN
  li.classList.add("fade-in");

  // SUPPRIME FADE-IN APRES L'ANIMATION
  setTimeout(() => {
    li.classList.remove("fade-in");
  }, 500); // Durée de l'animation fade-in

  // EVENEMENT POUR SUPPRIMER AVEC FADE-OUT
  suppBtn.addEventListener("click", function () {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      li.classList.add("fade-out");
      setTimeout(() => li.remove(), 500);
      sauvegarderListe(); // Sauvegarde après suppression
    }
  });

  // MODIFIER LE CONTENU DE L'ITEM EVENT
  modifier.addEventListener("click", function () {
    var inputModif = document.createElement("input");
    inputModif.value = li.firstChild.textContent; // Pré-remplir l'input avec le texte existant
    li.textContent = ""; // Efface le texte existant dans <li>
    li.appendChild(inputModif); // Ajoute l'input dans <li>

    // Écouteur pour valider avec la touche "Enter"
    inputModif.addEventListener("keydown", function (e) {
      if (inputModif.value.trim() === "") {
        alert("Le champ ne peut pas être vide.");
        inputModif.focus(); // Remet le curseur dans l'input
        return;
      }
      if (e.key === "Enter") {
        li.textContent = inputModif.value; // Remplace l'input par le nouveau texte

        // Réajouter les boutons "Modifier" et "Supprimer" après la modification
        li.appendChild(suppBtn); // Repositionner le bouton "Supprimer"
        li.appendChild(modifier); // Repositionner le bouton "Modifier"
        sauvegarderListe(); // Sauvegarde après modification
      }
    });
  });

  // AJOUT A LA LISTE
  list.appendChild(li);
  li.append(suppBtn);
  li.append(modifier);

  sauvegarderListe(); // Sauvegarde après ajout

  // RESET CHAMP INPUT
  textInput.value = "";
}

textInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Empêche le comportement par défaut (soumission d’un formulaire)

    // Vérifie si le champ n'est pas vide
    if (textInput.value.trim() === "") {
      alert("Le champ ne peut pas être vide.");
      textInput.focus(); // Replace le curseur dans l'input
      return;
    }

    // Appelle la fonction pour créer un nouvel élément
    buttonClick(e);
  }
});

// FONCTION SAVE LISTE
function sauvegarderListe() {
  localStorage.setItem("maListe", list.innerHTML);
}

// FONCTION TOUT SUPP
function toutSupp(e) {
  e.preventDefault();
  if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
    setTimeout(() => (list.innerHTML = "")); // Supprime uniquement le contenu de la liste
  }
}
