Hooks.on("renderCharacterSheet", (_, html) => {
  var amountToRegain = 5;
  const powersList = html.find(".sheet-body .tab.powers .pp-counter");
  const customPPGain = $(
    `<button class="custom-pp-button"><i class="fa-solid fa-square-plus"></i></button>`
  )
    .off("click")
    .on("click", gainCustomPP);

  const hourlyPPGain = $(
    `<button class="hourly-pp-button"><i class="fa-solid fa-clock"> ${amountToRegain}</i></button>`
  )
    .off("click")
    .on("click", function () {
      gainHourlyPP(amountToRegain);
    });
  const refreshPPButton = $(
    '<button class="refresh-pp-button"><i class="fa-solid fa-rotate-right"></i></button>'
  )
    .off("click")
    .on("click", resetAllPP);

  customPPGain.appendTo(powersList);
  hourlyPPGain.appendTo(powersList);
  refreshPPButton.appendTo(powersList);
});

function gainCustomPP() {
  const a = canvas.tokens.controlled[0].actor;
  const dgContent = $(
    `<div><p>Enter a number of power points to add</p><br><label for="PP">PP:</label><input type="number" id="PwrPts" name="PP" placeholder="Enter amount of PP"></div>`
  );
  const dg = new Dialog({
    title: "Regain Power Points",
    content: dgContent.html(),
    buttons: {
      add: {
        label: "Add PP",
        callback: () => {
          var ppToAdd = parseInt(document.getElementById("PwrPts").value);
          const powerPoints = a.system.powerPoints;
          for (const i in powerPoints) {
            const currentPP = parseInt(powerPoints[i].value);
            let newValue = currentPP + ppToAdd;
            newValue >= parseInt(powerPoints[i].max)
              ? (newValue = parseInt(powerPoints[i].max))
              : (newValue = newValue);
            const updatePath = `system.powerPoints.${i}.value`;
            var updates = {};
            updates[updatePath] = newValue;
            a.update(updates);
          }
        },
      },
    },
  }).render(true);
}

function gainHourlyPP(regain) {
  const a = canvas.tokens.controlled[0].actor;
  const powerPoints = a.system.powerPoints;
  for (const i in powerPoints) {
    const currentPP = parseInt(powerPoints[i].value);
    let newValue = currentPP + regain;
    newValue >= parseInt(powerPoints[i].max)
      ? (newValue = parseInt(powerPoints[i].max))
      : (newValue = newValue);
    const updatePath = `system.powerPoints.${i}.value`;
    var updates = {};
    updates[updatePath] = newValue;
    a.update(updates);
  }
}

function resetAllPP() {
  const a = canvas.tokens.controlled[0].actor;

  const powerPoints = a.system.powerPoints;
  for (const i in powerPoints) {
    const maxPP = parseInt(powerPoints[i].max);
    const updatePath = `system.powerPoints.${i}.value`;
    var updates = {};
    updates[updatePath] = maxPP;
    a.update(updates);
  }
}
