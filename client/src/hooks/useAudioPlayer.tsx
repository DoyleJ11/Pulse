import { useEffect, useState } from "react";

let player: HTMLAudioElement | null = null;

function useAudioPlayer() {}

function play(url: string) {
  player = new Audio(url);

  player.addEventListener("playing", (event) => {
    if (player) {
      player.pause();
      return;
    }
  });

  player.play();
}

function pause(id: string) {}
