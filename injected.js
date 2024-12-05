if (window.location.hostname.includes("famileo.com")) {
    document.addEventListener('change', function (event) {
        if (event.target.type === 'file') {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function () {
                    if (typeof EXIF !== 'undefined') {
                        EXIF.getData(file, function () {
                            const allTags = EXIF.getAllTags(this); // Récupère toutes les balises EXIF
                            console.log("Liste des balises EXIF disponibles : ", allTags);

                            const dateTime = EXIF.getTag(this, "DateTimeOriginal") ||
                                EXIF.getTag(this, "DateTimeDigitized") ||
                                EXIF.getTag(this, "DateTime") ||
                                EXIF.getTag(this, "GPSDateStamp") ||
                                null;

                            const formatDateTime = (dateTime) => {
                                if (!dateTime) return null;
                                const [date, time] = dateTime.split(" ");
                                const [year, month, day] = date.split(":");
                                const [hour, minute] = time.split(":");
                                return {
                                    formatted: `${day}/${month}/${year} à ${parseInt(hour)}h${minute}`,
                                    year,
                                    month,
                                    day,
                                    hour: parseInt(hour),
                                    minute,
                                };
                            };

                            const timeData = dateTime ? formatDateTime(dateTime) : null;

                            // Cibler le conteneur du datepicker
                            const datepickerContainer = document.querySelector(
                                "#ngb-nav-0-panel > app-family-wall > app-wall-post-edit > div > form > div > div.footer.mt-2.d-flex.flex-column.flex-sm-row.align-items-center > div.first-group.d-flex.justify-content-between.align-items-center.w-100 > div.date > esac-date-time-picker > form > div.datepicker.shift-right > div > ngb-datepicker > div.ngb-dp-content.ngb-dp-months"
                            );
                            if (!datepickerContainer) {
                                console.error("Impossible de trouver le conteneur du datepicker.");
                                return;
                            }

                            // Vérifiez s'il existe déjà un conteneur pour les boutons pour éviter les doublons
                            let buttonContainer = datepickerContainer.querySelector("#photoDateButtons");
                            if (!buttonContainer) {
                                buttonContainer = document.createElement("div");
                                buttonContainer.id = "photoDateButtons";
                                buttonContainer.style.marginTop = "5px"; // Ajouter un espace entre les boutons et les autres éléments
                                buttonContainer.style.textAlign = "center"; // Centrer les boutons
                                datepickerContainer.appendChild(buttonContainer);
                            }

                            // Nettoyage des anciens boutons
                            buttonContainer.innerHTML = "";

                            // Ajout du texte correspondant
                            const message = document.createElement("p");
                            message.style.fontSize = "small";
                            message.style.marginBottom = "5px";

                            if (timeData) {
                                console.log(`Date et heure de la photo : ${timeData.formatted}`);
                                message.textContent = `Photo prise le ${timeData.formatted}`;
                                buttonContainer.appendChild(message);

                                // Bouton "Mettre la date de la photo"
                                const setDateButton = document.createElement("button");
                                setDateButton.textContent = "Date & Heure native";
                                setDateButton.className = "btn btn-primary";
                                setDateButton.style.margin = "5px";
                                setDateButton.onclick = function () {
                                    const { year, month, day, hour, minute } = timeData;

                                    // Définir la date dans le datepicker
                                    setDateInDatepicker(year, month, day);

                                    // Définir l'heure dans le timepicker
                                    setTimeInTimepicker(hour, minute);
                                };
                                buttonContainer.appendChild(setDateButton);
                            } else {
                                console.warn("Aucune information de date/heure trouvée dans les métadonnées.");
                                message.textContent = "Pas de date native trouvée";
                                buttonContainer.appendChild(message);
                            }
                        });
                    } else {
                        console.error("EXIF.js n'est pas disponible dans la page.");
                    }
                };

                reader.onerror = function () {
                    console.error("Une erreur est survenue lors de la lecture du fichier.");
                };

                reader.readAsArrayBuffer(file);
            }
        }
    }, true);
}

// Fonction pour définir la date dans le datepicker
function setDateInDatepicker(year, month, day) {
    const monthSelect = document.querySelector("select[aria-label='Select month']");
    if (monthSelect) {
        monthSelect.value = month;
        monthSelect.dispatchEvent(new Event("change"));
    }

    const yearSelect = document.querySelector("select[aria-label='Select year']");
    if (yearSelect) {
        yearSelect.value = year;
        yearSelect.dispatchEvent(new Event("change"));
    }

    const dayButton = document.querySelector(`[aria-label='${getDayAriaLabel(year, month, day)}']`);
    if (dayButton) {
        dayButton.click();
    } else {
        console.error("Le jour spécifié n'est pas trouvable dans le calendrier.");
    }
}


// Fonction utilitaire pour générer l'attribut `aria-label`
function getDayAriaLabel(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction pour définir l'heure dans le timepicker
function setTimeInTimepicker(hour, minute) {
    const hourSelect = document.querySelector("select[aria-label='hourSelect']");
    const minuteSelect = document.querySelector("select[aria-label='minuteSelect']");

    if (hourSelect && minuteSelect) {
        hourSelect.value = hour;
        minuteSelect.value = minute;
        hourSelect.dispatchEvent(new Event("change"));
        minuteSelect.dispatchEvent(new Event("change"));

        console.log(`Heure mise à jour : ${hourSelect.value}h${minuteSelect.value}`);
    } else {
        console.error("Sélecteurs d'heure ou de minute introuvables.");
    }
}
