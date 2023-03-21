Hooks.on("renderCharacterSheet", (_, html) => {
  if (!game.settings.get("swade", "noPowerPoints")) {
    const a = canvas.tokens.controlled[0].actor;

    var amountToRegain = 5;

    if (a.items.some((i) => i.name === "Rapid Recharge")) {
      amountToRegain = 10;
    }
    if (a.items.some((i) => i.name === "Improved Rapid Recharge")) {
      amountToRegain = 20;
    }

    const powersList = html.find(".sheet-body .tab.powers");
    const ppButtonWrapper = $(
      '<div class="pp-buttons" style="display: flex; justify-content: center; align-items: center;"></div>'
    );
    const customPPGain = $(
      `<button class="custom-pp-button" data-tooltip="Add a custom amount of PP or add PP via Benny" data-tooltip-direction="UP"><i class="fa-solid fa-square-plus"></i></button>`
    )
      .off("click")
      .on("click", gainCustomPP);

    const hourlyPPGain = $(
      `<button class="hourly-pp-button" data-tooltip="Add PP from resting" data-tooltip-direction="UP"><i class="fa-solid fa-clock"> ${amountToRegain}</i></button>`
    )
      .off("click")
      .on("click", function () {
        gainHourlyPP(amountToRegain);
      });

    const refreshPPButton = $(
      '<button class="refresh-pp-button" data-tooltip="Refresh all PP" data-tooltip-direction="UP"><i class="fa-solid fa-rotate-right"></i></button>'
    )
      .off("click")
      .on("click", resetAllPP);

    customPPGain.appendTo(ppButtonWrapper);
    hourlyPPGain.appendTo(ppButtonWrapper);
    refreshPPButton.appendTo(ppButtonWrapper);

    ppButtonWrapper.prependTo(powersList);
  }
});

function gainCustomPP() {
  const a = canvas.tokens.controlled[0].actor;
  const arcaneBackgrounds = a.system.powerPoints;
  let arcaneSelections;
  for (const i in arcaneBackgrounds) {
    arcaneSelections += `<option value="${i}">${i}</option>`;
  }
  const dgContent = $(
    `<div>
    <p>Select an Arcane Background to add power points to</p>
    <select name="Arcane Background" id="arcane-background-selection">
    ${arcaneSelections}
    <option name="All">All</option>
    </select>
    <p>Enter a number of power points to add</p>
    <label for="PP"></label>
    <input type="number" id="PwrPts" name="PP" placeholder="Enter amount of PP">
    </div>`
  );
  new Dialog({
    title: "Regain Power Points",
    content: dgContent.html(),
    buttons: {
      add: {
        label: "Add PP",
        callback: () => {
          var ppToAdd = parseInt(document.getElementById("PwrPts").value);
          var arcaneBackgroundSelection = document.getElementById(
            "arcane-background-selection"
          ).value;
          const powerPoints = a.system.powerPoints;

          let newValue;
          let updatePath;
          let currentPP;
          if (arcaneBackgroundSelection === "All") {
            for (const i in powerPoints) {
              currentPP = parseInt(powerPoints[i].value);

              currentPP + ppToAdd >= parseInt(powerPoints[i].max)
                ? (newValue = parseInt(powerPoints[i].max))
                : (newValue = currentPP + ppToAdd);
              updatePath = `system.powerPoints.${i}.value`;
              var allUpdates = {};
              allUpdates[updatePath] = newValue;
              a.update(allUpdates);
            }
            return;
          } else {
            currentPP = parseInt(powerPoints[arcaneBackgroundSelection].value);
            currentPP + ppToAdd >=
            parseInt(powerPoints[arcaneBackgroundSelection].max)
              ? (newValue = parseInt(
                  powerPoints[arcaneBackgroundSelection].max
                ))
              : (newValue = currentPP + ppToAdd);
            updatePath = `system.powerPoints.${arcaneBackgroundSelection}.value`;
          }
          var updates = {};
          updates[updatePath] = newValue;
          a.update(updates);
        },
      },
      benny: {
        label: "From a Benny!",
        callback: () => {
          var ppToAdd = game.settings.get(
            "ms-tiny-swade-tweaks",
            "bennyPPValue"
          );
          var arcaneBackgroundSelection = document.getElementById(
            "arcane-background-selection"
          ).value;
          const powerPoints = a.system.powerPoints;

          let newValue;
          let updatePath;
          let currentPP;
          if (arcaneBackgroundSelection === "All") {
            for (const i in powerPoints) {
              currentPP = parseInt(powerPoints[i].value);

              currentPP + ppToAdd >= parseInt(powerPoints[i].max)
                ? (newValue = parseInt(powerPoints[i].max))
                : (newValue = currentPP + ppToAdd);
              updatePath = `system.powerPoints.${i}.value`;
              var allUpdates = {};
              allUpdates[updatePath] = newValue;
              a.update(allUpdates);
            }
            return;
          } else {
            currentPP = parseInt(powerPoints[arcaneBackgroundSelection].value);
            currentPP + ppToAdd >=
            parseInt(powerPoints[arcaneBackgroundSelection].max)
              ? (newValue = parseInt(
                  powerPoints[arcaneBackgroundSelection].max
                ))
              : (newValue = currentPP + ppToAdd);
            updatePath = `system.powerPoints.${arcaneBackgroundSelection}.value`;
          }
          var updates = {};
          updates[updatePath] = newValue;
          a.update(updates);
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
    let newValue;
    currentPP + regain >= parseInt(powerPoints[i].max)
      ? (newValue = parseInt(powerPoints[i].max))
      : (newValue = currentPP + regain);
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
