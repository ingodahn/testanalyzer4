<template>
  <div id="showExport">
    <v-card outlined raised>
      <v-card-title>Daten aus OPAL exportieren</v-card-title>
      <v-card-text>
        <ol>
          <li class="exportLi">
            <div class="exportTxt">
              Sie loggen sich beim OPAL Ihrer Hochschule (im Beispiel die HTWK
              Leipzig) ein, gehen auf das Tab
              <b>Lehre & Lehren</b> und lassen sich die von Ihnen
              <b>administrierten Veranstaltungen</b> anzeigen, von denen Sie die
              gewünschte (im Beispiel Mathematik I) auswählen.
            </div>
            <div class="exportImg">
              <img src="./assets/DatenexportA.png" />
            </div>
          </li>
          <li class="exportLi">
            <div class="exportTxt">
              Wählen Sie in der mittleren Werkzeugleiste den Pfeil nach unten
              und anschließend die zweite Option
              <b>Datenarchivierung</b> aus.
            </div>
            <div class="exportImg">
              <img src="./assets/DatenexportB.png" />
            </div>
          </li>
          <li class="exportLi">
            <div class="exportTxt">
              <p>
                Klicken Sie in der Liste links die erste Option
                <b>Tests und Fragebögen</b> an und wählen sie
                <b>Archivierung starten</b> aus.
              </p>
            </div>
            <div class="exportImg">
              <img src="./assets/DatenexportC.png" />
            </div>
          </li>
          <li>
            <div class="exportTxt">
              <p>
                Daraufhin erscheint ein Pop-Up-Fenster mit allen in der
                Veranstaltung integrierten Tests (hier im Beispiel als Belege
                bezeichnet).
              </p>
            </div>
            <br/>
            <div class="exportImg">
              <img src="./assets/DatenexportD.png" />
            </div>
          </li>
          <li class="exportLi">
            <div class="exportTxt">
              <p>
                Klicken Sie nun auf
                <b>Auswählen</b> in der Zeile, die zu dem Test gehört, dessen
                Ergebnisse Sie zu exportieren wünschen (im Beispiel Beleg 2).
              </p>
              <p>
                <b>Achtung:</b>
                Der nun stattfindende Vorgang der Archivierung kann einige
                Sekunden in Anspruch nehmen, ohne dass eine Bestätigung
                angezeigt wird.
              </p>
            </div>

            <div>

              <div class="exportImg">
                <img src="./assets/DatenexportE.png" />
              </div>
            </div>
          </li>
          <li class="exportLi">
            <div class="exportTxt">
              <p>
                Ist die Archivierung abgeschlossen, erscheint schließlich ein
                weiteres Pop-Up-Fenster
                <b>Archivierung beendet</b>.
              </p>
            </div>
            <div class="exportImg">
              <img src="./assets/DatenexportF.png" />
            </div>
          </li>
          <li class="exportLi">
            <div class="exportTxt">
              <p>
                Wenn Sie in diesem Pop-Up auf
                <b>Datei anzeigen</b> klicken haben Sie die Möglichkeit, die
                Testergebnisse als
                <i>.csv-Datei</i> abzuspeichern.
              </p>
            </div>
            <div class="exportImg">
              <img src="./assets/DatenexportG.png" />
            </div>
          </li>
        </ol>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "Export"
};
</script>
<style scoped>
.exportLi {
  -webkit-columns: 2 95mm;
  columns: 2 95mm;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
}

img {
  width: 100%;
  height: auto;
}

.exportTxt {
  padding-bottom: 10px;
}

.exportImg {
  border: 1px solid hsl(198, 65%, 40%);
  border-radius: 10px;
  box-shadow: -10px 19px 15px silver;
}
</style>
  