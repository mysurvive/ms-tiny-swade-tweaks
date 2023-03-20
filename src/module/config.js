Hooks.on("init", async () => {
  game.settings.register("ms-tiny-swade-tweaks", "bennyPPValue", {
    name: "Banny Power Point Value",
    hint: "The amount of power points a benny is worth",
    scope: "world",
    config: true,
    type: Number,
    default: 5,
  });
});
