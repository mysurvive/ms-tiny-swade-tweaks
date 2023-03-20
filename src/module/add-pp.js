Hooks.on("renderCharacterSheet", (_, html) => {
  const a = actor;
  const powersList = html.find(".sheet-body.tab.powers");
});
const a = actor;
const dgContent = $(
  `<div><p>Enter a number of power points to add or click "Reset Power Points" to add all back</p><br><label for="PP">PP:</label><input type="number" id="PwrPts" name="PP" placeholder="Enter amount of PP"></div>`
);

const dg = new Dialog({
  title: "Edit Power Points",
  content: dgContent.html(),
  buttons: {
    add: {
      label: "Add PP",
      callback: () => {
        var ppToAdd = parseInt(document.getElementById("PwrPts").value);
        const powerPoints = a.system.powerPoints;
        for (const i in powerPoints) {
          const currentPP = parseInt(powerPoints[i].value);
          const newValue = currentPP + ppToAdd;
          const updatePath = `system.powerPoints.${i}.value`;
          var updates = {};
          updates[updatePath] = newValue;
          a.update(updates);
        }
      },
    },
    resetPP: {
      label: "Reset PP",
      callback: () => {
        const powerPoints = a.system.powerPoints;
        for (const i in powerPoints) {
          const maxPP = parseInt(powerPoints[i].max);
          const updatePath = `system.powerPoints.${i}.value`;
          var updates = {};
          updates[updatePath] = maxPP;
          a.update(updates);
        }
      },
    },
  },
}).render(true);
